import Button from 'shared/components/button'
import Counter from 'shared/components/counter'
import { useRouter } from "next/router";

export default function Components() {
  const router = useRouter()
  return (
    <>
      <h1>Components</h1>

      {/* TODO: use image from shared folder
        <Image src="/shared/assets/img/logo/logo.svg" alt="HOLI" width={50} height={50} /> */}
      
      <Button text="Go to Users" onPress={() => router.push('/users')}/>
      <Button text="Go to Feed" onPress={() => router.push('/feed')}/>
      <Counter />
    </>
  );
}
