import Link from 'next/link'
import { highBackground } from '@design/blur.css'
import { Box, Heading, Card, Stack, Input, Textarea, Button, IconArrowLeft } from '@kalidao/reality'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useAccount, useContractRead } from 'wagmi'
import { KEEP_ABI, KEEP_HELPER_ABI, KEEP_HELPER_ADDRESS } from '~/constants'
import { getTxHash } from '../getTxHash'
import { SendToken } from './SendToken'
import { useQuery } from 'wagmi'
import { fetcher } from '~/utils'

type Props = {
  setView: React.Dispatch<React.SetStateAction<string>>
}

const operation = (op: number) => {
  switch (op) {
    case 0:
      return 'call'
    case 1:
      return 'delegatecall'
    case 2:
      return 'create'
  }
}

const Transaction = ({ setView }: Props) => {
  const router = useRouter()
  const { chainId, keep } = router.query
  const { address: author } = useAccount()
  const { data: meta, isLoading, isError } = useQuery(['keep', chainId, keep], async () =>
    fetcher(`${process.env.NEXT_PUBLIC_KEEP_API}/keeps/${chainId}/${keep}/`),
  )
  const [data, setData] = useState('')
  const [value, setValue] = useState('0')
  const [op, setOp] = useState(0)
  const [to, setTo] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { data: nonce, refetch: refetchNonce } = useContractRead({
    address: keep as `0xstring`,
    abi: KEEP_ABI,
    functionName: 'nonce',
  })

  // console.log('parsed ether', ethers.utils.parseEther(value))

  const notSigner = meta?.signers?.find((s: string) => s === author?.toLowerCase()) == undefined ? true : false

  const handleTx = async () => {
    if (chainId && keep) {
      const { data: nonce } = await refetchNonce()
      if (!nonce) return
      const digest = await getTxHash(Number(chainId), keep as string, op, to, value, data, nonce.toString())
      console.log('nonce', nonce)
      console.log('digest', Number(chainId), keep as string, op, to, value, data, nonce.toString(), digest)

      if (digest == 'error') {
        return
      }

      if (!nonce) return
      const body = {
        op: operation(op),
        to: to,
        data: data,
        nonce: nonce.toString(),
        value: ethers.utils.parseEther(value).toString(),
        txHash: digest,
        title: title,
        content: content,
        authorAddress: author,
      }
      console.log('body', body)

      const send = await fetch(`${process.env.NEXT_PUBLIC_KEEP_API}/keeps/${chainId}/${keep}/addTx`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((res) => res.json())

      console.log('send', send)
    }

    // TODO: Add success/error toast
    router.push(`/${chainId}/${keep}`)
  }

  // TODO: Signal for Guilds
  return (
    <Box className={highBackground}>
      <Stack direction={'horizontal'} justify="space-between">
        <Link href={`/${chainId}/${keep}`} passHref>
          <Button shape="circle" variant="tertiary" size="small" as="a">
            <IconArrowLeft />
          </Button>
        </Link>
        <Box width="full">
          <Stack>
            <Input label="Title" description="" placeholder="Title" onChange={(e) => setTitle(e.currentTarget.value)} />
            <Textarea
              label="Description"
              description=""
              placeholder="What is this transaction about?"
              onChange={(e) => setContent(e.currentTarget.value)}
            />
            <SendToken to={to} setTo={setTo} data={data} setData={setData} />
            <Button onClick={handleTx} disabled={isLoading || isError || notSigner}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

export default Transaction
