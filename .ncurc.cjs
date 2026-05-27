const getPrereleaseChannel = (release) =>
  typeof release === 'string' && release.length > 0 ? release.split('.')[0] : ''

module.exports = {
  filterResults: (_packageName, { currentVersionSemver, upgradedVersionSemver }) => {
    const currentChannel = getPrereleaseChannel(currentVersionSemver?.[0]?.release)
    const upgradedChannel = getPrereleaseChannel(upgradedVersionSemver?.release)

    return currentChannel === '' || upgradedChannel === '' || currentChannel === upgradedChannel
  },
}
