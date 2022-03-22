import { GetServerSideProps, NextPage } from 'next'
import { getUsers, UserData } from 'shared/api'
import UsersComponent from 'shared/components/Users'

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      users: await getUsers(),
    },
  }
}

const Users: NextPage<{ users: Array<UserData> }> = ({ users }) => {
  return (
    <>
      <h1>Users</h1>
      <UsersComponent users={users} />
    </>
  )
}

export default Users
