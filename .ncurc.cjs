const getPrereleaseChannel = (release) =>
  typeof release === 'string' && release.length > 0 ? release.split('.')[0] : ''

module.exports = {
  filterResults: (packageName, { currentVersionSemver, upgradedVersionSemver }) => {
    if (packageName === 'typescript') {
      return upgradedVersionSemver?.major === currentVersionSemver?.[0]?.major
    }

    const currentChannel = getPrereleaseChannel(currentVersionSemver?.[0]?.release)
    const upgradedChannel = getPrereleaseChannel(upgradedVersionSemver?.release)

    return currentChannel === '' || upgradedChannel === '' || currentChannel === upgradedChannel
  },
}
