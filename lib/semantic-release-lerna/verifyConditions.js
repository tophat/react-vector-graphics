const verifyConditions = (options, { nextRelease, logger }) => {
    logger.log('Verify: options(%s), release(%s)', options, nextRelease)
}

module.exports = {
    verifyConditions,
}
