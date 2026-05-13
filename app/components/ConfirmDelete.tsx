// Used in: Contact, DeviceInfo, DeviceSetupInfo, methodInfo, ServerInfo, ScanToEmail, ScanToFolder
'use client'

import { Trash } from '@/app/components'
import { Button, Dialog, Flex } from '@radix-ui/themes'

interface Props {
  onConfirm: () => void
  title?: string
  description?: string
  confirmLabel?: string
}

const ConfirmDelete = ({
  onConfirm,
  title = 'Delete',
  description = 'Are you sure? This cannot be undone.',
  confirmLabel = 'Delete',
}: Props) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <div className="text-2xl text-gray-500 hover:text-red-600 cursor-pointer inline-block">
          <Trash />
        </div>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="400px">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button variant="solid" color="red" onClick={onConfirm}>{confirmLabel}</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ConfirmDelete
