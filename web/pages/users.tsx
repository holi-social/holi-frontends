import { GetServerSidePropsContext } from "next";
import { getUsers, UserData } from "shared/api";
import UsersComponent from "shared/components/Users";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      users: await getUsers(),
    },
  };
}

export default function Users({ users }: { users: Array<UserData> }) {
  return (
    <>
      <h1>Users</h1>
      <UsersComponent users={users} />
    </>
  );
}
