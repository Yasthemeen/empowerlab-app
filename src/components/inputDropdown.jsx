/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { Handle } from 'reactflow';
import CreatableSelect from 'react-select/creatable';
import '../style.css';

function InputDropdown({ data }) {
  const selectProps = {
    isDisabled: true,
    value: data.value ? { value: data.value, label: data.value } : null,
    options: data.factors.map((f) => ({ value: f, label: f })),
    menuIsOpen: false,
    className: 'react-select-disabled',
    classNamePrefix: 'react-select',
    styles: {
      control: (base) => ({
        ...base,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: 'none',
      }),
      valueContainer: (base) => ({
        ...base,
        pointerEvents: 'none',
        backgroundColor: 'transparent',
      }),
      singleValue: (base) => ({
        ...base,
        backgroundColor: 'transparent',
      }),
      indicatorsContainer: (base) => ({
        ...base,
        display: 'none',
      }),
      input: (base) => ({
        ...base,
        backgroundColor: 'transparent',
      }),
    },
  };
  return (
    <div className={`dropdown${data.value ? ' has-value' : ''}`}>
      <div className="dropdown-label" style={{ marginBottom: 4 }}>{data.label}</div>
      <div className="select-bubble">
        <CreatableSelect
          {...selectProps}
          placeholder={`Select ${data.label}`}
        />
      </div>
      <Handle
        type="source"
        position="bottom"
        style={{ background: 'transparent', border: 'none' }}
      />
      <Handle
        type="target"
        position="top"
        style={{ background: 'transparent', border: 'none' }}
      />
    </div>
  );
}
export default InputDropdown;
