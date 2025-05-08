const sharp = require('sharp');

sharp('public/code.svg')
  .resize(32, 32)
  .toFile('public/favicon.ico')
  .then(() => {
    console.log('Favicon created successfully');
    // Also copy to build directory
    sharp('public/favicon.ico')
      .toFile('build/favicon.ico')
      .then(() => console.log('Favicon copied to build directory'))
      .catch(err => console.error('Error copying to build:', err));
  })
  .catch(err => console.error('Error creating favicon:', err));
