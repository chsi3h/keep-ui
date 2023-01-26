import { Stack, Box, Text } from '@kalidao/reality'
import { timestampToTimepassed } from '~/utils/prettyDate'
import { useTxStore } from '~/dashboard/useTxStore'
import { getExplorerLink } from '~/utils/getExplorerLink'
import { useKeepStore } from '~/dashboard/useKeepStore'

export const Result = () => {
  const tx = useTxStore((state) => state)
  const keep = useKeepStore((state) => state)

  console.log('tx', tx)

  return (
    <>
      {tx?.executedOn && (
        <Box
          as="a"
          href={getExplorerLink(tx?.executionHash as string, 'tx', keep?.chainId ?? 1)}
          target="_blank"
          rel="noopenner noreferrer"
          color="text"
          style={{
            fontStyle: 'italic',
          }}
        >
          Executed {timestampToTimepassed(tx?.executedOn)}
          {' ago.'}
        </Box>
      )}
    </>
  )
}