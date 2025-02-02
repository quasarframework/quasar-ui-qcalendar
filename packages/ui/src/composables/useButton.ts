import { h, VNode } from 'vue'
import useFocusHelper from './useFocusHelper'

interface ButtonProps {
  focusable: boolean
  focusType: string[]
}

export default function useButton(): {
  renderButton: (
    _props: ButtonProps,
    _data: Record<string, any>,
    _slotData: VNode | VNode[] | string,
  ) => VNode
} {
  function renderButton(
    { focusable, focusType }: ButtonProps,
    data: Record<string, any>,
    slotData: VNode | VNode[] | string,
  ): VNode {
    // Ensure the button is focusable based on props
    const isFocusable = focusable && focusType.includes('date')

    return h('button', { ...data, tabindex: isFocusable ? 0 : -1 }, [
      slotData,
      isFocusable && useFocusHelper(),
    ])
  }

  return { renderButton }
}
