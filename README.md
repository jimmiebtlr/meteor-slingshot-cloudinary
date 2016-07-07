
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

# File Upload Options
Cloudinary allows a number of [file upload options](http://cloudinary.com/documentation/node_image_upload#all_upload_options), as documented in their nodejs API. A few of these options are supported for now.

### tags (optional)
A tag name or an array with a list of tag names to assign to the uploaded image.

    Slingshot.createDirective('videos', Slingshot.Cloudinary, {
        authorize() {...},
        key() {...},
        tags: ['tag1', 'tag2']
    });

### folder (optional)
An optional folder name where the uploaded resource will be stored. The public ID contains the full path of the uploaded resource, including the folder name.

    Slingshot.createDirective('videos', Slingshot.Cloudinary, {
        authorize() {...},
        key() {...},
        folder: myFolder
    });

# Todo

There is still work to be done.  Pull requests welcome.

- [ ] Improve handling of video, image, and raw upload types.
- [ ] Check that public_id is checked using the signature.
- [ ] Implement all the file upload options supported by cloudinary
