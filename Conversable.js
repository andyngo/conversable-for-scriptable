// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: grin-squint;
// initialize contacts

const fm = FileManager.iCloud()

const SETTINGS = {
  BG_COLOR: '#151515',
  BG_IMAGE: {
    SHOW_BG: false,
    IMAGE_PATH: 'bg.png',
  },
  BG_OVERLAY: {
    SHOW_OVERLAY: false,
    OVERLAY_COLOR: '#111111',
    OPACITY: 0.5,
  },
  PADDING: 8,
  TITLE_FONT_SIZE: 18,
  PHOTO_SIZE: 60,
  NAME_FONT_SIZE: 11,
  RANDOMIZE_CONTACTS: false,
  NO_OF_CONTACTS_TO_SHOW: 4,
}

const contacts_list = [
  {
    name: 'Placeholder',
    phone: '+0123456789',
    type: 'sms',
    photo: '1.png',
  },
  {
    name: 'Placeholder',
    phone: '+0123456789',
    type: 'facetime',
    photo: '2.png',
  },
  {
    name: 'Placeholder',
    phone: '+0123456789',
    type: 'call',
    photo: '3.png',
  },
  {
    name: 'Placeholder',
    phone: '+0123456789',
    type: 'whatsapp',
    photo: '4.png',
  },
]

function validateSettings() {
  if (SETTINGS.NO_OF_CONTACTS_TO_SHOW > contacts_list.length) {
    console.warn('Requested more contacts than available')
    SETTINGS.NO_OF_CONTACTS_TO_SHOW = contacts_list.length
  }
  if (SETTINGS.PHOTO_SIZE < 0) {
    throw new Error('Invalid photo size')
  }
}

function validateContact(contact) {
  const requiredFields = ['name', 'photo', 'type']
  return requiredFields.every((field) => contact[field])
}

// Process contacts based on settings
let contacts
if (SETTINGS.RANDOMIZE_CONTACTS) {
  contacts = [...contacts_list]
    .filter(validateContact)
    .sort(() => 0.5 - Math.random())
    .slice(0, SETTINGS.NO_OF_CONTACTS_TO_SHOW)
} else {
  contacts = [...contacts_list]
    .filter(validateContact)
    .slice(0, SETTINGS.NO_OF_CONTACTS_TO_SHOW)
}

async function getDefaultImage() {
  // Implement default image logic here
  // This could be a solid color image or a built-in placeholder
  let draw = new DrawContext()
  draw.size = new Size(SETTINGS.PHOTO_SIZE, SETTINGS.PHOTO_SIZE)
  draw.setFillColor(new Color('#999999'))
  draw.fillRect(new Rect(0, 0, SETTINGS.PHOTO_SIZE, SETTINGS.PHOTO_SIZE))
  return draw.getImage()
}

async function getImg(image) {
  try {
    let folderName = 'Conversable'
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir + '/' + folderName, image)
    await fm.downloadFileFromiCloud(path)

    if (fm.fileExists(path)) {
      return fm.readImage(path)
    }
    console.log(`Image ${image} not found, using default`)
    return await getDefaultImage()
  } catch (error) {
    console.error(`Error loading image ${image}: ${error}`)
    return await getDefaultImage()
  }
}

const ACTION_TYPES = {
  sms: (phone) => ({
    serviceUrl: `sms://${phone}`,
    icon: SETTINGS.ICONS.SMS,
  }),
  call: (phone) => ({
    serviceUrl: `tel://${phone}`,
    icon: SETTINGS.ICONS.PHONE,
  }),
  mail: (email) => ({
    serviceUrl: `mailto://${email}`,
    icon: SETTINGS.ICONS.MAIL,
  }),
  facetime: (phone) => ({
    serviceUrl: `facetime://${phone}`,
    icon: SETTINGS.ICONS.FACETIME,
  }),
  'facetime-audio': (phone) => ({
    serviceUrl: `facetime-audio://${phone}`,
    icon: SETTINGS.ICONS.FACETIME,
  }),
  whatsapp: (phone) => ({
    serviceUrl: `whatsapp://send?text=&phone=${phone}`,
    icon: SETTINGS.ICONS.WHATSAPP,
  }),
  twitter: (twitter_id) => ({
    serviceUrl: `twitter://messages/compose?recipient_id=${twitter_id}`,
    icon: SETTINGS.ICONS.TWITTER,
  }),
  telegram: (username) => ({
    serviceUrl: `tg://resolve?domain=${username}`,
    icon: SETTINGS.ICONS.TELEGRAM,
  }),
}

async function CreateAction(contact) {
  const actionCreator = ACTION_TYPES[contact.type]
  if (!actionCreator) {
    throw new Error(`Unsupported contact type: ${contact.type}`)
  }

  const param =
    contact.type === 'mail'
      ? contact.email
      : contact.type === 'twitter'
      ? contact.twitter_id
      : contact.type === 'telegram'
      ? contact.telegram_username
      : contact.phone

  return actionCreator(param)
}

async function CreateContact(contact, row) {
  if (!contact || !row) return

  let { PHOTO_SIZE, NAME_FONT_SIZE } = SETTINGS
  let { photo, name } = contact

  try {
    let { serviceUrl, icon } = await CreateAction(contact)

    let contactStack = row.addStack()
    contactStack.layoutVertically()
    contactStack.url = serviceUrl
    contactStack.accessibilityLabel = `Contact ${contact.name}. Tap to ${contact.type}`

    let photoStack = contactStack.addStack()
    photoStack.addSpacer()

    let img = await getImg(photo)
    let contactPhoto = photoStack.addImage(img)
    contactPhoto.imageSize = new Size(PHOTO_SIZE, PHOTO_SIZE)
    contactPhoto.cornerRadius = PHOTO_SIZE / 2
    contactPhoto.applyFillingContentMode()

    photoStack.addSpacer()
    contactStack.addSpacer(4)

    let nameStack = contactStack.addStack()
    nameStack.addSpacer()

    let iconPath = await getImg(icon)
    let appIcon = nameStack.addImage(iconPath)
    appIcon.imageSize = new Size(12, 12)

    nameStack.addSpacer(4)

    let contactName = nameStack.addText(name)
    contactName.font = Font.mediumSystemFont(NAME_FONT_SIZE)
    contactName.lineLimit = 1

    nameStack.addSpacer()
  } catch (error) {
    console.error(`Error creating contact ${contact.name}: ${error}`)
  }
}

async function CreateWidget(contacts) {
  let { BG_COLOR, BG_IMAGE, BG_OVERLAY, PADDING, TITLE_FONT_SIZE } = SETTINGS
  let w = new ListWidget()

  try {
    w.backgroundColor = new Color(BG_COLOR)
    w.setPadding(PADDING, PADDING, PADDING, PADDING)

    if (BG_IMAGE.SHOW_BG) {
      let bg = await getImg(BG_IMAGE.IMAGE_PATH)
      w.backgroundImage = bg
    }

    if (BG_OVERLAY.SHOW_OVERLAY) {
      let overlayColor = new Color(
        BG_OVERLAY.OVERLAY_COLOR,
        BG_OVERLAY.OPACITY || 0.3
      )
      let gradient = new LinearGradient()
      gradient.colors = [overlayColor, overlayColor]
      gradient.locations = [0, 1]
      w.backgroundGradient = gradient
    }

    w.addSpacer()

    let containerStack = w.addStack()
    containerStack.layoutVertically()

    let titleStack = containerStack.addStack()
    titleStack.addSpacer()

    let title = titleStack.addText('Start a conversation with')
    title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE)

    titleStack.addSpacer()
    containerStack.addSpacer(16)

    let contactRowStack = containerStack.addStack()
    contactRowStack.centerAlignContent()
    contactRowStack.addSpacer()

    for (const contact of contacts) {
      await CreateContact(contact, contactRowStack)
    }

    contactRowStack.addSpacer()
    w.addSpacer()

    return w
  } catch (error) {
    console.error(`Error creating widget: ${error}`)
    // Return a basic error widget
    let errorWidget = new ListWidget()
    errorWidget.addText('Error loading widget')
    return errorWidget
  } finally {
    // Clean up resources
    w.backgroundImage = null
  }
}

// Main execution
try {
  validateSettings()
  let w = await CreateWidget(contacts)
  w.presentMedium()
} catch (error) {
  console.error(`Fatal error: ${error}`)
}

Script.complete()
