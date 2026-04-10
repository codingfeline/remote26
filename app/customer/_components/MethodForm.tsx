const MethodForm = () => {
  return (
    <div>
      <label htmlFor="name">
        Name
        <input type="text" id="name" name="name" />
      </label>
      <label htmlFor="url">
        URL
        <input type="text" id="url" name="url" />
      </label>
    </div>
  )
}

export default MethodForm
