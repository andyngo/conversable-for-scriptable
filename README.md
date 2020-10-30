# Conversable for Scriptable

![Cover image for Conversable](https://github.com/andyngo/conversable-for-scriptable/blob/main/conversable.png)

Notes:

1. This script requires Scriptable version 1.5.1 as it relies on a few newly added APIs such as `.addStack()` and `.url()`.

2. An alternate version of this widget can be found [here](https://github.com/andyngo/conversable-plus-for-scriptable). The alt version (Conversable+) supports showing a list of actions when you tap on a contact. Consider using the alt version if you prefer having multiple actions per contact.

---

## What is this?

Conversable is a simple contacts widget for Scriptable. With Conversable, you can quickly\*:

1. Open an iMessage conversation for a contact
2. Start a Facetime call with a contact
3. Start a Facetime Audio call with a contact
4. Make a cellular call to your contact
5. Open a WhatsApp conversation for a contact

\*Caveat: The standard limitation with iOS 14 applies here: any URLs opened through a widget will require its host app to launch first before the URL can be opened.

## Instructions

1. Download and extract the content of this repository into the Scriptable folder located in your iCloud Drive.

Your Scriptable folder structure should look like this:

```
iCloud Drive/
├─ Scriptable/
│  ├─ Conversable.js
│  ├─ Conversable/
│  │  ├─ 1.png
│  │  ├─ 2.png
│  │  ├─ 3.png
│  │  ├─ 4.png
│  │  ├─ icons/

```

2. Launch Scriptable and make sure that Conversable is listed in the Scripts view.

3. Run the script and you should see a preview of the Medium-sized widget with placeholder contacts if everything is set up correctly.

4. To customize the contacts, open Conversable.js in the Scriptable editor and modify the `contacts_list` array. For example, change:

```
// default config
const contact_list = [
  {
    name: "Placeholder",
    phone: "+1234567890",
    type: "sms",
    photo: "1.png"
  },
  // the rest of the array goes here
]
```

to something like this of your own:

```
const contact_list = [
  {
    name: "John Doe", // the name of the contact
    phone: "+0123456789", // enter your contact's phone no, with country-code if necessary
    type: "sms", // the type of communication method that you prefer. see supported services below.
    photo: "john.png" // the photo of the contact. the image file goes inside the Conversable folder where 1.png, 2.png, etc resides.
  },
  // the rest of the array goes here
]
```

5. Repeat the steps above for up to 4 contacts. Conversable currently supports showing up to 4 contacts within a row. Feel free to tweak the code if you need to add more contacts to a row.

6. Once you've added your own contacts, run the script and verify that everything is working correctly.

7. Return to your home screen and add a Medium Scriptable widget.

8. Edit the Scriptable widget and choose Conversable as the Script. Next, set "When Interacting" to "Run Script" and you should be all set and ready to go.

---

## Settings

Conversable supports several simple configurations as of version 1.1.

```
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
```

| Settings                   | Types                           |
| -------------------------- | ------------------------------- |
| `BG_COLOR`                 | Hex Value `string`              |
| `BG_IMAGE.SHOW_BG`         | Boolean `true` or `false`       |
| `BG_IMAGE.IMAGE_PATH`      | BG image filename/path `string` |
| `BG_OVERLAY.SHOW_OVERLAY`  | Boolean `true` or `false`       |
| `BG_OVERLAY.OVERLAY_COLOR` | Hex Value `string`              |
| `BG_OVERLAY.OPACITY`       | Any value from 0 to 1 `float`   |
| `PADDING`                  | 8 (Default) `number`            |
| `TITLE_FONT_SIZE`          | 18 (Default) `number`           |
| `PHOTO_SIZE`               | 60 (Default) `number`           |
| `NAME_FONT_SIZE`           | 11 (Default) `number`           |
| `RANDOMIZE_CONTACTS`       | Boolean `true` or `false`       |
| `NO_OF_CONTACTS_TO_SHOW`   | 4 (Default) `number`            |

Feel free to tweak these settings as you see fit.

---

## Supported Services (Apps)

| Services (Apps) | Type             | Accepts           |
| --------------- | ---------------- | ----------------- |
| iMessage/SMS    | "sms"            | phone             |
| Mail            | "mail"           | mail              |
| Facetime        | "facetime"       | phone             |
| Facetime Audio  | "facetime-audio" | phone             |
| Telephone       | "call"           | phone             |
| Telegram        | "telegram"       | telegram_username |
| Twitter         | "twitter"        | twitter_id        |
| WhatsApp        | "whatsapp"       | phone             |

Twitter example:

```
{
  name: "Andy",
  type: "twitter",
  twitter_id: "11009532", // there are tools out there that allow you to get this
  photo: "1.png"
}
```

I've also included several more icons in the `/icons` folder that might be useful if you figure out a way to add more services to the list.

---

## Known Issues & Troubleshooting

### My icons and contact names are missing.

- Sometimes the images would fail to download and would cause the entire row of icon and contact name to not show up. You can try to troubleshoot this issue by:

1. Checking the `Conversable` folder in your iCloud Drive and making sure that all the images are uploaded correctly. If your files show 'Waiting...', try toggling Airplane Mode on and off to restart the upload.

2. Renaming the `Conversable` to something else ie: `Conversable1` or something else. Remember to also change the folder path in `Conversable.js` to reflect the newly renamed folder:

```
async function getImg(image) {
  let folder = "/Conversable1"
  // the rest of the code
```

3. If none of the steps above worked for you, please reach out on [Twitter](https://twitter.com/andyngo) and I'll see what I can do.

### The widget is not rendering correctly in the Small/Large size.

- Right now the widget only supports the Medium widget size. I'll consider adapting this to support the Small and Large sizes if I get enough requests for it.

---

## About this project

This script is authored by [@andyngo](https://twitter.com/andyngo) (me) as a fun little side project to try out the scripting capabilities of Scriptable.

If you like this project, consider viewing https://extendedicons.com for custom-made icons for your Shortcuts, or [buy me a coffee](https://www.buymeacoffee.com/andyngo). You can also follow me on [Twitter](https://twitter.com/andyngo) for updates.
