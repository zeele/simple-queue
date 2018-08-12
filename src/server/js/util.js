import uuidV4 from 'uuid/v4'
import moment from 'moment'

const Util = {
  generateUuid: () => uuidV4(),
  generateTimestamp: () => moment().format('hh:mm:ss'),
  generateExpTime: () => moment().add(15, 'seconds').format('hh:mm:ss')
}

export default Util
