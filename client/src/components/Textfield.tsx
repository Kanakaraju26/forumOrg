function Textfield(props: { placeholder: string | undefined; }) {
  return <input type="text" placeholder={props.placeholder} />;
}
export default Textfield;