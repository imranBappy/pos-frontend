import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password:String! ) {
    loginUser(email: $email, password: $password) {
        token
        success
        message
        user{
            id
            name
            email
            role {
              id
              name
            }
            outlet {
              name
              email
              isActive
              id
              phone
              createdAt
              address
            }
        }
    }
}
`;

export const USER_REGISTER = gql`
mutation MyMutation($email: String!, $name: String!, $password: String!, $phone: String) {
  registerUser(email: $email, name: $name, password: $password, phone: $phone) {
    message
    success
    id
  }
}
`

export const PROFILE_MUTATION = gql`
mutation MyMutation($dateOfBirth: Date, $gender: String, $name: String, $id: String, $phone: String, $photo: String, $role: ID, $isActive: Boolean) {
  profileUpdate(
    input: {dateOfBirth: $dateOfBirth, gender: $gender, name: $name, phone: $phone, photo: $photo, id: $id, role: $role, isActive: $isActive}
  ) {
    success
    message
    profile {
      name
      role {
        id
        name
      }
      gender
      phone
      photo
      id
      isVerified
      isActive
      email
      updatedAt
      createdAt
    }
  }
}
`

export const PASSWORD_RESET_MAIL_MUTATION = gql`
  mutation MyMutation($email: String!) {
    passwordResetMail(email: $email) {
      message
      success
    }
  }
`

export const RESET_PASSWORD_MUTATION = gql`
mutation MyMutation($otp: String!, $email: String!, $password: String!) {
  passwordReset(email: $email, otp: $otp, password: $password) {
    message
    success
  }
}
`
export const ADDRESS_MUTATION = gql`
 mutation MyMutation($address: String, $area: String, $city: String, $country: String, $house: String, $id: String, $state: String, $street: String, $user: ID!, $addressType: String) {
  addressCud(
    input: {address: $address, area: $area, city: $city, country: $country, house: $house, id: $id, state: $state, street: $street, user: $user, addressType: $addressType}
  ) {
    success
    address {
      id
      addressType
      address
      area
      city
      country
      createdAt
      default
      house
    }
  }
}
`

export const BUILDING_MUTATION = gql`
  mutation MyMutation($address: ID!, $name: String!, $id: String , $latitude: Float, $longitude: Float, $photo: String , $floor: String ) {
    buildingCud(
      input: {name: $name, address: $address, floor: $floor, id: $id, latitude: $latitude, longitude: $longitude, photo: $photo}
    ) {
      success
      id
      }
  }
`
export const ADDRESS_DEFAULT_UPDATE = gql`
mutation MyMutation($addressType: String!, $user: ID!) {
  addressUpdate(addressType: $addressType, user: $user) {
    success
  }
}
`