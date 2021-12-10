const faker = require('faker')
const Driver = require('../models/Driver')
require('./database')

const generateDrivers = (num = 10) => {
  if (num <= 0) {
    return
  }

  for (let i = 0; i < num; i++) {
    let object = {
      profile: {
        name: {
          first_name: faker.name.firstName(),
          middle_name: faker.name.middleName(),
          last_name: faker.name.lastName()
        },
        sex: ['Male', 'Female'][i % 2 == 0 ? 0 : 1]
      },
      contact: {
        number: '09613454976',
        email: faker.internet.email(),
        address: {
          barangay: faker.address.streetAddress(),
          municipality: faker.address.city(),
          province: faker.address.state()
        }
      },
      vehicle: {
        plate_number: faker.datatype.uuid(),
        franchise_number: faker.datatype.uuid(),
        license_number: faker.datatype.uuid()
      }
    }

    Driver.create(object)
  }

  console.log('Done')
}

generateDrivers(100)