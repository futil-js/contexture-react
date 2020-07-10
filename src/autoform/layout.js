import _ from 'lodash/fp'
import F from 'futil'
import React from 'react'
import { _getAdministration } from 'mobx'
import { observer } from 'mobx-react'
import { Grid, Flex, Button, ErrorList } from '../greyVest'
import * as f from './futil'
import { getField } from './index'

export let forwardRefObserver = _.flow(React.forwardRef, observer)

let statusMap = {
  failed: 'danger',
  succeeded: 'success',
  processing: '',
}

let CommandButton = ({
  command,
  children,
  style,
  disabled,
  className = 'primary',
  type,
}) => {
  if (command.state.status === 'failed' && command.state.error !== null) {
    console.error(command.state.error)
  }
  return (
    <Flex
      as={Button}
      alignItems="center"
      justifyContent="center"
      onClick={command}
      disabled={command.state.processing || disabled}
      className={_.getOr(className, command.state.status, statusMap)}
      type={type}
      style={style}
    >
      <span
        style={{
          visibility: _.isEmpty(command.state.status) ? 'visible' : 'hidden',
        }}
      >
        {children}
      </span>
      <span style={{ position: 'absolute' }}>{command.state.status}</span>
    </Flex>
  )
}

let FormContext = React.createContext()

let Form = ({ children, form, ...props }) => (
  <form onSubmit={e => e.preventDefault()} {...props}>
    <FormContext.Provider value={form}>{children}</FormContext.Provider>
  </form>
)

export let Field = forwardRefObserver(({ path, ...props }, ref) => {
  let form = React.useContext(FormContext)
  let field = getField(form, path)
  let {
    component: { as: Component, useEffect = _.noop, ...componentProps } = {},
    label = _.startCase(_.last(f.slashEncoder.decode(path))),
    hideLabel,
    description,
  } = field

  React.useEffect(() => useEffect({ path, form, field }), [])

  let errors = _.get(path, form.errors)
  let id = `${_getAdministration(form).name}${path}`
  let descriptionId = `${id}.description`
  let isRoot = _.isEmpty(path)

  return (
    <div {...props}>
      {!hideLabel && (
        <div style={{ marginBottom: isRoot ? 24 : 8, marginLeft: 2 }}>
          <label htmlFor={id} style={{ fontWeight: 'bold' }}>
            {isRoot ? <h3 style={{ marginBottom: 8 }}>{label}</h3> : label}
          </label>
          {description && (
            <div id={descriptionId} style={{ opacity: 0.7 }}>
              {description}
            </div>
          )}
        </div>
      )}
      <Component
        {...componentProps}
        {...(!hideLabel && { id })}
        {...(description && { 'aria-describedby': descriptionId })}
        path={path}
        form={form}
        ref={ref}
      />
      <ErrorList style={{ marginTop: 8, marginLeft: 2, fontWeight: 'bold' }}>
        {errors}
      </ErrorList>
    </div>
  )
})
Field.displayName = 'Field'

export let FieldList = ({ path, form, ...props }) => (
  <Grid gap={16} {...props}>
    {F.mapIndexed(
      (field, name) =>
        !field.hidden && <Field key={name} path={f.joinPaths(path, name)} />,
      getField(form, path).fields
    )}
  </Grid>
)

let ResetButton = observer(({ onReset, children, ...props }) => {
  let form = React.useContext(FormContext)
  return (
    <Button
      disabled={_.get('state.processing', form.submit)}
      onClick={_.over([form.reset, onReset])}
      {...props}
    >
      {children || 'Reset'}
    </Button>
  )
})
ResetButton.displayName = 'ResetButton'

let SubmitButton = observer(
  ({ onSuccess = _.noop, submitLabel = 'Submit', children, ...props }) => {
    let form = React.useContext(FormContext)
    return (
      <CommandButton
        type="submit"
        command={f.onCommandSuccess(_.over([form.clean, onSuccess]))(
          form.submit
        )}
        {...props}
      >
        {children || submitLabel}
      </CommandButton>
    )
  }
)
SubmitButton.displayName = 'SubmitButton'

let SubmitErrors = observer(({ style, ...props }) => {
  let form = React.useContext(FormContext)
  let submitError = F.getOrReturn('message', form.submit.state.error)
  let showError = _.isEmpty(form.errors) && submitError !== 'Validation Error'
  return (
    showError && (
      <ErrorList style={{ fontWeight: 'bold', ...style }} {...props}>
        {submitError}
      </ErrorList>
    )
  )
})
SubmitErrors.displayName = 'SubmitErrors'

export let SimpleForm = ({
  onSuccess,
  onCancel,
  submitLabel,
  cancelLabel = 'Cancel',
  form,
  ...props
}) => (
  <Grid as={Form} gap={24} form={form} {...props}>
    <Field />
    <Flex justifyContent="flex-end">
      {onCancel && (
        <ResetButton onReset={onCancel} style={{ marginRight: 16 }}>
          {cancelLabel}
        </ResetButton>
      )}
      <SubmitButton {...{ onSuccess, submitLabel }} />
    </Flex>
    <SubmitErrors style={{ justifySelf: 'end' }} />
  </Grid>
)
