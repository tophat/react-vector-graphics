const prepare = (options, { nextRelease, logger }) => {
    logger.log('Prepare: options(%s), release(%s)', options, nextRelease)
}

module.exports = {
    prepare,
}
