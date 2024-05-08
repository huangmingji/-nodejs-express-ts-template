import { settings } from "../settings";
const { CustomSnowflakeId } = require('snowflakeid-producer');

export const SnowflakeId = new CustomSnowflakeId({
    MachineIdBits: 10,
    SequenceBits: 12,
    MachineId: settings.snowflake.workerid,
    FirstTimestamp: new Date('2024-05-03T00:00:00.000Z')
});