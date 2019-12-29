const publish = (options, { nextRelease, logger }) => {
    logger.log('Publish: options(%s), release(%s)', options, nextRelease)
}

module.exports = {
    publish,
}
