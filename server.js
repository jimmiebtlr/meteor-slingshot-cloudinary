Slingshot.Cloudinary = {
  directiveMatch: {
    CloudinaryCloudName: String,
    CloudinaryKey: String,
    CloudinarySecret: String,
    CloudinaryPreset: String,

    key: Match.OneOf(String, Function),
  },

  directiveDefault: Object.assign({}, {
    CloudinarySecret: Meteor.settings.CloudinarySecret,
    CloudinaryKey: Meteor.settings.CloudinaryKey,
    CloudinaryCloudName: Meteor.settings.CloudinaryCloudName,
    CloudinaryPreset: Meteor.settings.CloudinaryPreset,
  }),

  isImage(file) {
    return _.contains(['image/jpg', 'image/png', 'image/svg'], file.type);
  },

  type(file) {
    return this.isImage(file) ? 'image' : 'video';
  },

  upload: function upload(method, directive, file) {
    const { CloudinaryCloudName } = directive;
    const publicId = directive.key();

    // Cloudinary's node lib supplies most of what we need.
    const cloudinarySign = this.cloudinarySign(publicId, directive, file);

    const postData = _.map(cloudinarySign.hidden_fields,
      (value, name) => { return { value, name }; }
    );

    const type = this.type(file);

    const retVal = {
      upload: cloudinarySign.form_attrs.action,
      download: `http://res.cloudinary.com/${CloudinaryCloudName}/${type}/upload/${publicId}`,
      postData,
    };

    return retVal;
  },

  cloudinarySign: function sign(publicId, directive, file) {
    const options = _.extend({
      public_id: publicId,
      upload_preset: directive.CloudinaryPreset,
      api_key: directive.CloudinaryKey,
      api_secret: directive.CloudinarySecret,
      cloud_name: directive.CloudinaryCloudName,

      // TODO make isImage more robust, add isVideo, and allow
      // raw uploads.  Probably better if isImage and isVideo
      // isn't in this lib.
      resource_type: this.type(file),
    });

    const signature = Cloudinary.uploader.direct_upload('', options);

    return signature;
  },
};
