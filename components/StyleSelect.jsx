import Select from "react-select";

export default function StyleSelect({
  options,
  defaultValue,
  id,
  invisible,
  setChange = null,
  tabIndex = "0",
}) {
  return (
    <fieldset className="min-w-[250px]">
      <label
        htmlFor={`select-${id}`}
        className={`capitalize ${invisible ? "invisible" : null}`}
      >
        Select {id === 'indicator' ? 'data type' : id}
      </label>
      <Select
        id={`select-${id}`}
        instanceId={`select-${id}`}
        name={id}
        options={options}
        defaultValue={defaultValue}
        onChange={setChange}
        tabIndex={tabIndex}
        className='select-with-caps'
      />
    </fieldset>
  );
}
