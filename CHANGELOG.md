# Changelog
## [Unreleased]

## Latest - 2020-02-01

### Added
- Add a `display` option to the basic usage to display specific layers by default
- Minimal mode markers feature

### Fixed
- Layer menu removing layers from the layer menu showing only globally available layers upon refresh

## 2.2.0 - 2020-01-28

### Added
- Add PL people layer
- Add an `addLayersToMap` option in basic usage
- Ability to choose between using leaflet's default layer control and LEL's new layer menu when instantiating LEL

### Changed
- Bump LBL to 1.7.0
- Implement new layer menu in LEL's basic usage
- Update documentation
- Move new layer menu styles and custom leaflet control styles to dist/LeafletEnvironmentalLayers.css from example/styles.css

### Fixed
- Fix multiple maps sharing the same default base tile layer by [@z-arnott](https://github.com/z-arnott)
- Fix errors on some layers when trying to display them from hash when out of bounds
- Fix styles for layer group name and layer description
- Fix overriding of default leaflet classes
