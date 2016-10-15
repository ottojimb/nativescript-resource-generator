# Nativescript resource generator

Small script that generates multi-resolution images for nativescript folder.
It transforms the ".jpg, .gif, .png" format files.

# Installation

1. Install imagemagick: 

> `brew install imagemagick`

2. Install nodejs
3. Clone this repository: 

> `git clone https://github.com/ottojimb/nativescript-resource-generator.git`

4. Access to the create folder

> `cd nativescript-resource-generator`

5. Install as global package

> `npm -g install .`

# Usage

> `ns-convert path/to/assets_gallery path/to/nativescript/App_Resources` 

# Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

# History

## v0.0.2:

* Created global package definition
* Fix bug when the animated gif returns multiple sizes (one for each frame)
* Better documentation 

## v0.0.1: 

* First release 

# TODO

* Clean code (it was a quickly implementation)
* Verify it on windows

## License

MIT