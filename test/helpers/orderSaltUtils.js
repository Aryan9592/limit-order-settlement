const { ethers } = require('hardhat');

/* eslint-disable no-multi-spaces */
const TIME_START_MASK        = 0xFFFFFFFF00000000000000000000000000000000000000000000000000000000n; // prettier-ignore
const DURATION_MASK          = 0x00000000FFFFFFFF000000000000000000000000000000000000000000000000n; // prettier-ignore
const INITIAL_RATE_BUMP_MASK = 0x0000000000000000FFFF00000000000000000000000000000000000000000000n; // prettier-ignore
const FEE_MASK               = 0x00000000000000000000FFFFFFFF000000000000000000000000000000000000n; // prettier-ignore
const SALT_MASK              = 0x0000000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFn; // prettier-ignore
/* eslint-enable no-multi-spaces */

const TIME_START_SHIFT = 224n; // orderTimeMask 224-255
const DURATION_SHIFT = 192n; // durationMask 192-223
const INITIAL_RATE_BUMP_SHIFT = 176n; // initialRateMask 176-191
const FEE_SHIFT = 144n; // orderFee 144-175

const initSaltObj = (orderSalt) => {
    return {
        startTime: (orderSalt & TIME_START_MASK) >> TIME_START_SHIFT,
        duration: (orderSalt & DURATION_MASK) >> DURATION_SHIFT,
        initialRate: (orderSalt & INITIAL_RATE_BUMP_MASK) >> INITIAL_RATE_BUMP_SHIFT,
        fee: (orderSalt & FEE_MASK) >> FEE_SHIFT,
        salt: orderSalt & SALT_MASK,
    };
};

const encodeParameters = (startTime, duration, initialRate, fee, salt) => {
    const abiCoder = ethers.utils.defaultAbiCoder;
    return (
        '0x' +
        abiCoder.encode(['uint32'], [startTime]).slice(-8) +
        abiCoder.encode(['uint32'], [duration]).slice(-8) +
        abiCoder.encode(['uint16'], [initialRate]).slice(-4) +
        abiCoder.encode(['uint32'], [fee]).slice(-8) +
        abiCoder.encode(['uint144'], [salt]).slice(-36)
    );
};

const getStartTime = (orderSalt) => {
    return (orderSalt & TIME_START_MASK) >> TIME_START_SHIFT;
};

const getDuration = (orderSalt) => {
    return (orderSalt & DURATION_MASK) >> DURATION_SHIFT;
};

const getInitialRateBump = (orderSalt) => {
    return (orderSalt & INITIAL_RATE_BUMP_MASK) >> INITIAL_RATE_BUMP_SHIFT;
};

const getFee = (orderSalt) => {
    return (orderSalt & FEE_MASK) >> FEE_SHIFT;
};

const getSalt = (orderSalt) => {
    return orderSalt & SALT_MASK;
};

module.exports = {
    initSaltObj,
    encodeParameters,
    getStartTime,
    getDuration,
    getInitialRateBump,
    getFee,
    getSalt,
};
