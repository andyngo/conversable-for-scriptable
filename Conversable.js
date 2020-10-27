// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: grin-squint;
// initialize contacts
const contacts_list = [
  {
    name: "Placeholder",
    phone: "+0123456789",
    type: "sms",
    photo: "1.png",
  },
  {
    name: "Placeholder",
    phone: "+0123456789",
    type: "facetime",
    photo: "2.png",
  },
  {
    name: "Placeholder",
    phone: "+0123456789",
    type: "call",
    photo: "3.png",
  },
  {
    name: "Placeholder",
    phone: "+0123456789",
    type: "whatsapp",
    photo: "4.png",
  },
];

const SETTINGS = {
  BG_COLOR: "#151515",
  BG_IMAGE: {
    SHOW_BG: false,
    IMAGE_PATH: "bg.png",
  },
  BG_OVERLAY: {
    SHOW_OVERLAY: false,
    OVERLAY_COLOR: "#111111",
    OPACITY: 0.5,
  },
  PADDING: 8,
  TITLE_FONT_SIZE: 18,
  PHOTO_SIZE: 60,
  NAME_FONT_SIZE: 11,
  RANDOMIZE_CONTACTS: false,
  NO_OF_CONTACTS_TO_SHOW: 4,
};

// check if RANDOMIZE_CONTACTS is enabled. If it's set to `true`, randomize the contacts_list array.
if (SETTINGS.RANDOMIZE_CONTACTS == true) {
  contacts = [...contacts_list]
    .sort(() => 0.5 - Math.random())
    .slice(0, SETTINGS.NO_OF_CONTACTS_TO_SHOW);
} else {
  contacts = [...contacts_list].slice(0, SETTINGS.NO_OF_CONTACTS_TO_SHOW);
}

// A function to download images
async function getImg(image) {
  let fm = FileManager.iCloud();
  let dir = fm.documentsDirectory();
  let path = fm.joinPath(dir + "/Conversable", image);
  let download = await fm.downloadFileFromiCloud(path);
  let isDownloaded = await fm.isFileDownloaded(path);

  if (fm.fileExists(path)) {
    return fm.readImage(path);
  } else {
    console.log("Error: File does not exist.");
  }
}

async function CreateAction(contact) {
  let { phone, email, twitter_id, telegram_username } = contact;
  let serviceUrl;
  let icon;

  switch (contact.type) {
    case "sms":
      serviceUrl = `sms://${phone}`;
      icon = "icons/sms.png";
      break;
    case "call":
      serviceUrl = `tel://${phone}`;
      icon = "icons/phone.png";
      break;
    case "mail":
      serviceUrl = `mailto://${email}`;
      icon = "icons/mail.png";
      break;
    case "facetime":
      serviceUrl = `facetime://${phone}`;
      icon = "icons/facetime.png";
      break;
    case "facetime-audio":
      serviceUrl = `facetime-audio://${phone}`;
      icon = "icons/facetime.png";
      break;
    case "whatsapp":
      serviceUrl = `whatsapp://send?text=&phone=${phone}`;
      icon = "icons/whatsapp.png";
      break;
    case "twitter":
      serviceUrl = `twitter://messages/compose?recipient_id=${twitter_id}`;
      icon = "icons/twitter.png";
      break;
    case "telegram":
      serviceUrl = `tg://resolve?domain=${telegram_username}`;
      icon = "icons/telegram.png";
      break;
  }

  return { serviceUrl, icon };
}

// A function to create contacts (to be displayed in the widget).
async function CreateContact(contact, row) {
  let { PHOTO_SIZE, NAME_FONT_SIZE } = SETTINGS;

  let { photo, name } = contact;
  let { serviceUrl, icon } = await CreateAction(contact);

  let contactStack = row.addStack();
  contactStack.layoutVertically();

  contactStack.url = serviceUrl;

  let photoStack = contactStack.addStack();

  photoStack.addSpacer();

  let img = await getImg(photo);
  let contactPhoto = photoStack.addImage(img);
  contactPhoto.imageSize = new Size(PHOTO_SIZE, PHOTO_SIZE);
  contactPhoto.cornerRadius = PHOTO_SIZE / 2;
  contactPhoto.applyFillingContentMode();

  photoStack.addSpacer();

  contactStack.addSpacer(4);

  let nameStack = contactStack.addStack();

  nameStack.addSpacer();

  let iconPath = await getImg(icon);
  let appIcon = nameStack.addImage(iconPath);
  appIcon.imageSize = new Size(12, 12);

  nameStack.addSpacer(4);

  let contactName = nameStack.addText(name);
  contactName.font = Font.mediumSystemFont(NAME_FONT_SIZE);
  contactName.lineLimit = 1;

  nameStack.addSpacer();
}

async function CreateWidget(contacts) {
  let { BG_COLOR, BG_IMAGE, BG_OVERLAY, PADDING, TITLE_FONT_SIZE } = SETTINGS;

  let w = new ListWidget();
  w.backgroundColor = new Color(BG_COLOR);
  w.setPadding(PADDING, PADDING, PADDING, PADDING);

  // Show background image if SHOW_BG is set to `true`.
  if (BG_IMAGE.SHOW_BG == true) {
    let bg = await getImg(BG_IMAGE.IMAGE_PATH);
    w.backgroundImage = bg;
  }

  // Show overlay if SHOW_OVERLAY is set to `true`. For light background images, it is recommended that you turn overlay on so that the contact names and text remain legible.
  if (BG_OVERLAY.SHOW_OVERLAY == true) {
    let overlayColor = new Color(
      BG_OVERLAY.OVERLAY_COLOR,
      BG_OVERLAY.OPACITY || 0.3
    );
    let gradient = new LinearGradient();
    gradient.colors = [overlayColor, overlayColor];
    gradient.locations = [0, 1];
    w.backgroundGradient = gradient;
  }

  w.addSpacer();

  let containerStack = w.addStack();
  containerStack.layoutVertically();

  let titleStack = containerStack.addStack();

  titleStack.addSpacer();

  let title = titleStack.addText("Start a conversation with");
  title.font = Font.boldRoundedSystemFont(TITLE_FONT_SIZE);

  titleStack.addSpacer();

  containerStack.addSpacer(16);

  let contactRowStack = containerStack.addStack();
  contactRowStack.centerAlignContent();

  contactRowStack.addSpacer();

  contacts.map((contact) => {
    CreateContact(contact, contactRowStack);
  });

  contactRowStack.addSpacer();

  w.addSpacer();

  Script.setWidget(w);

  return w;
}

let w = await CreateWidget(contacts);
w.presentMedium();
Script.complete();
