import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface KeyboardState {
  isOpen: boolean
  isValueFocused: boolean
  isValue2Focused: boolean
  isValue3Focused: boolean
  value: string
  value2: string
  value3: string
  height: number
  inputLimit: number
}

const initialState: KeyboardState = {
  isOpen: false,
  isValueFocused: false,
  isValue2Focused: false,
  isValue3Focused: false,
  inputLimit: 60,
  value: '',
  value2: '',
  value3: '',
  height: 0,
}

export const keyboardSlice = createSlice({
  name: 'keyboard',
  initialState,
  reducers: {
    openKeyboard: (state) => {
      state.isOpen = true
    },
    closeKeyboard: (state) => {
      state.isOpen = false
    },
    updateValue: (state, action: PayloadAction<string>) => {
      state.value = action.payload
    },
    updateValue2: (state, action: PayloadAction<string>) => {
      state.value2 = action.payload
    },
    updateValue3: (state, action: PayloadAction<string>) => {
      state.value3 = action.payload
    },
    setKeyboardHeight: (state, action: PayloadAction<number>) => {
      state.height = action.payload
    },
    setIsValueFocused: (state, action: PayloadAction<boolean>) => {
      state.isValueFocused = action.payload
    },
    setIsValue2Focused: (state, action: PayloadAction<boolean>) => {
      state.isValue2Focused = action.payload
    },
    setIsValue3Focused: (state, action: PayloadAction<boolean>) => {
      state.isValue3Focused = action.payload
    },
    resetInputs: (state) => {
      state.value = ''
      state.value2 = ''
      state.value3 = ''
      state.isValueFocused = false
      state.isValue2Focused = false
      state.isValue3Focused = false
      state.inputLimit = 60
    },
    focusValue: (state) => {  
      state.isValueFocused = true
      state.isValue2Focused = false
      state.isValue3Focused = false
    },
    focusValue2: (state) => {
      state.isValueFocused = false
      state.isValue2Focused = true
      state.isValue3Focused = false
    },
    focusValue3: (state) => {
      state.isValueFocused = false
      state.isValue2Focused = false
      state.isValue3Focused = true
    },
    setInputLimit: (state, action: PayloadAction<number>) => {
      state.inputLimit = action.payload
    },
    resetKeyboardSlice: (state) => {
      state = initialState
    },
  },
})

export const { 
  openKeyboard, closeKeyboard, updateValue, setKeyboardHeight,
  updateValue2, updateValue3, resetInputs, focusValue, focusValue2,
  focusValue3, setIsValueFocused, setIsValue2Focused, setIsValue3Focused,
  setInputLimit, resetKeyboardSlice
} = keyboardSlice.actions
export default keyboardSlice.reducer