import Cloudinary from 'cloudinary';

Slingshot.Cloudinary = {
  directiveMatch: {
    CloudinaryCloudName: String,
    CloudinaryKey: String,
    CloudinarySecret: String,
    CloudinaryPreset: String,

    key: Match.OneOf(String, Function),

    tags: Match.Optional(Match.OneOf(String, [String])),
    folder: Match.Optional(String),
  },

  directiveDefault: Object.assign({}, {
    CloudinarySecret: Meteor.settings.CloudinarySecret,
    CloudinaryKey: Meteor.settings.CloudinaryKey,
    CloudinaryCloudName: Meteor.settings.CloudinaryCloudName,
    CloudinaryPreset: Meteor.settings.CloudinaryPreset,
  }),

  isImage(mime) {
    return _.contains(['image/jpeg','image/jpg', 'image/png', 'image/svg', 'application/pdf'], mime);
  },

  isVideo(type) {
    return _.contains(
      ['video/mp4'],
      type
    );
  },

  resourceType(type) {
    return this.isImage(type)
      ? 'image'
      : this.isVideo(type)
        ? 'video'
        : 'raw';
  },

  upload: function upload(method, directive, file, meta) {
    const { CloudinaryCloudName } = directive;
    const publicId = directive.key(method, file, meta);

    // Cloudinary's node lib supplies most of what we need.
    const cloudinarySign = this.cloudinarySign(publicId, directive, file);

    const postData = _.map(cloudinarySign.hidden_fields,
      (value, name) => { return { value, name }; }
    );

    const type = this.resourceType(file.type);

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
      resource_type: this.resourceType(file.type),
    });

    // Assign optional cloudinary options
    if (_.has(directive, 'tags')) options.tags = directive.tags;
    if (_.has(directive, 'folder')) options.folder = directive.folder;

    const signature = Cloudinary.uploader.direct_upload('', options);

    return signature;
  },
};
