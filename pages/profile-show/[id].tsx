import { ProfileShowPage as ProfileShowPageComponent } from '@/sources/profile/ProfileShowPage'
import { useRouter } from 'next/router'

function getQueryParam(
  param: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(param)) return param[0]
  return param
}

export default function ProfileShowPage() {
  const router = useRouter()
  const id = getQueryParam(router.query.id)

  return <ProfileShowPageComponent id={id} />
}
