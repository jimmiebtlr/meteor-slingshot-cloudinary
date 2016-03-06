
    meteor add jimmiebtlr:slingshot-cloudinary

# Use

## Cloudinary Console

You'll need to create a upload preset in cloudinary.  I belive the following options are needed.

- Mode: Signed
- UseFilename: true
- UniqueFilename: No

## Your app

### server.js

    Slingshot.fileRestrictions('videos', {
      allowedFileTypes: ['video/mp4'],
      maxSize: 500000000,
    });

    Slingshot.createDirective('videos', Slingshot.Cloudinary, {
      authorize() {
        if (!this.userId) {
          const message = 'Please login before posting files';
          throw new Meteor.Error('Login Required', message);
        }

        return true;
      },

      key() {
        return Meteor.uuid();
      },
    });


### settings.js

    {
      "CloudinaryCloudName": "cloud_name",
      "CloudinarySecret": "secret",
      "CloudinaryKey": "key",
      "CloudinaryPreset": "preset"
    }


# Todo

There is still work to be done.  Pull requests welcome.

-[ ] Improve handling of video, image, and raw upload types.
-[ ] Check that public_id is checked using the signature.
