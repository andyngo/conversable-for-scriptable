# Conversable for Scriptable

![Cover image for Conversable](https://github.com/andyngo/conversable-for-scriptable/blob/master/conversable.png)

Note: This script requires Scriptable version 1.5.1 as it relies on a few newly added APIs such as `.addStack()` and `.url()`.

---

## What is this?

Conversable is a simple chat widget for Scriptable. With Conversable, you can quickly\*:

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
3. Go ahead and run it and you should see a preview of the Medium-sized widget if everything is working correctly.

4. To customize the contacts, open up Conversable.js in the Scriptable editor and modify the `contacts_list` array. For example, change:

```
// default config
const contact_list = [
  {
    name: "Placeholder",
    phone: "+1234567890",
    type: "sms",
    photo: "1.png"
  },
  // the rest of the objects go here
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
  // the rest of the objects go here
]
```

5. Repeat the steps for up to 4 contacts. Conversable currently supports only showing up to 4 contacts within a row. Feel free to tweak the code if you need to add more contacts to a row.

6. Once everything is configured, run the script and verify that everything is working correctly.

7. Go back to your home screen and add a Medium Scriptable widget.

8. Edit the Scriptable widget and choose Conversable as the Script. Next, set "When Interacting" to "Run Script" and you should be all set and ready to go.

---

## Supported Services (Apps)

| Services (Apps) | type             | accepts           |
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
  twitter_id: "11009532", // there are tools out there that allow you to get this
  type: "twitter",
  photo: "1.png"
}
```

I've also included several more icons in the `/icons` folder that might be useful if you figure out a way to add more services to the list.

---

## Known Issues

- Sometimes the images would fail to download. In the event where that happens, check the `Conversable` folder in your iCloud Drive to make sure that the images are uploaded correctly. If you see 'Waiting...' on your files, try toggling Airplane Mode on and off to restart the upload.
- Right now the widget only supports the Medium widget size. I'll look at ways to adapt this for the Small and Large sizes.
- Dark Mode only, for now. You can always customize the text and background yourself if you want to make this work for Light Mode.

---

## About this project

This script is authored by [@andyngo](https://twitter.com/andyngo) (me) as a fun little side project to try out the scripting capibilities of Scriptable. Turns out you can do quite a lot with Scriptable so I plan to make a few more delightful widgets likethis.

If you like this project, consider viewing https://extendedicons.com for more home screen customization options or follow me on [Twitter](https://twitter.com/andyngo).
