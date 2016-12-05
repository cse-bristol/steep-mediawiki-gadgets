## Normal users can't upload
$wgGroupPermissions['user']['upload'] = false;

## Any file type is allowed
$wgStrictFileExtensions = false;

## Allow large files
$wgUploadSizeWarning = 1024 * 1024 * 100;
$wgMaxUploadSize = 1024 * 1024 * 100;

## Allow Thumbnails for large images
$wgMaxImageArea = 10000 * 10000;