import {
  Stack,
  Input,
  Button,
  Heading,
  IconArrowRight,
  IconPlus,
  IconClose,
  Box,
  Divider,
  Text,
  FieldSet,
} from '@kalidao/reality'
import { useForm, useFieldArray, useWatch } from 'react-hook-form'
import Back from './Back'
import * as styles from './create.css'
import { PostIt } from './PostIt'
import { CreateStore, useCreateStore } from './useCreateStore'

export const Signers = () => {
  const state = useCreateStore((state) => state)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<CreateStore>({
    defaultValues: {
      signers: state.signers,
      threshold: state.threshold,
    },
    mode: 'onBlur',
  })
  const { fields, append, remove } = useFieldArray({
    name: 'signers',
    control,
  })
  const watchedSigners = useWatch({
    name: 'signers',
    control,
  })
  const watchedThreshold = useWatch({
    name: 'threshold',
    control,
  })

  const onSubmit = (data: CreateStore) => {
    const { signers, threshold } = data

    state.setSigners(signers)
    state.setThreshold(threshold)

    state.setView('nft')
  }

  const maxSigners = 9
  const addSigner = () => {
    if (watchedSigners.length > maxSigners) {
      setError(`signers.${watchedSigners.length - 1}.address`, {
        type: 'maxLength',
        message: 'Max signers reached.',
      })
      return
    }
    append({
      address: '',
    })
  }

  return (
    <Box className={styles.shell} as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'horizontal'}>
        <Stack>
          <Stack>
            <Back setView={state.setView} to={'identity'} />
            <Heading level="2">Choose initial members</Heading>
          </Stack>
          <Divider />
          <Box className={styles.form}>
            <FieldSet legend="Signers" description="This will form the initial signer group. It can be changed later.">
              {fields.map((field, index) => {
                return (
                  <Box width="128" key={index}>
                    <Box
                      width="full"
                      key={field.id}
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent={'flex-start'}
                      gap="5"
                    >
                      <Input
                        width="full"
                        label="Signer"
                        hideLabel
                        placeholder="0x"
                        {...register(`signers.${index}.address` as const, {
                          required: {
                            value: true,
                            message: 'Address is required',
                          },
                          pattern: {
                            value: /^0x[a-fA-F0-9]{40}$/,
                            message: 'Not a valid ethereum address',
                          },
                        })}
                        defaultValue={field.address}
                        error={errors?.signers?.[index]?.address && errors?.signers?.[index]?.address?.message}
                      />
                      <Button
                        shape="circle"
                        variant="secondary"
                        tone="red"
                        size="small"
                        type="button"
                        onClick={() => {
                          remove(index)
                        }}
                      >
                        <IconClose />
                      </Button>
                    </Box>
                  </Box>
                )
              })}
              <Button
                size="small"
                prefix={<IconPlus />}
                type="button"
                tone="green"
                variant="secondary"
                onClick={addSigner}
              >
                Add Signer
              </Button>
            </FieldSet>
            <Divider />
            <Input
              label="Threshold"
              description="The number of signers required for a transaction to pass."
              type="number"
              inputMode="numeric"
              min="1"
              max={watchedSigners.length.toString()}
              error={errors?.threshold && errors?.threshold?.message}
              {...register(`threshold`, {
                required: true,
                max: watchedSigners.length,
              })}
              labelSecondary={`${watchedThreshold}/${watchedSigners.length}`}
            />
            <Button suffix={<IconArrowRight />} width="full" type="submit">
              Next
            </Button>
          </Box>
        </Stack>
        <Stack>
          <PostIt title="What is a signer?">
            <Text>A signer can be a wallet or smart contract wallet that can approve or reject transactions.</Text>
          </PostIt>
          <PostIt title="What is a threshold?">
            <Text>
              The threshold is the number of signers required for a transaction to pass. For example, if you set the
              threshold to 2, then 2 signers must sign a transaction for it to pass.
            </Text>
          </PostIt>
          {watchedSigners.length == 1 && watchedThreshold == 1 && (
            <PostIt title="1/1 Warning" warning={true}>
              <Text>
                If you set the threshold to 1/1 and the signer key is lost or comprimised you will not be able to
                recover your funds. We recommend setting the threshold to 2/3 minimum.
              </Text>
            </PostIt>
          )}
          {watchedSigners.length > 1 && watchedThreshold == 1 && (
            <PostIt title={`1/${watchedSigners.length} Warning`} warning={true}>
              <Text>
                If you set the threshold to 1/{watchedSigners.length} and one of the signer key is lost or comprimised
                all of the funds can be drained.
              </Text>
            </PostIt>
          )}
          {watchedSigners.length == watchedThreshold && watchedSigners.length != 1 && (
            <PostIt title={`${watchedThreshold}/${watchedSigners.length} Warning`} warning={true}>
              <Text>
                If you set the threshold to {watchedThreshold}/{watchedSigners.length} you will need all of the signers
                to sign on a transaction. This can be a problem if one of the signers is lost or comprimised. We
                recommend setting the threshold at least one less than the number of signers.
              </Text>
            </PostIt>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
