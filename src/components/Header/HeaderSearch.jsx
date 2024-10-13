import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/Input';

function HeaderSearch() {
  const navigate = useNavigate();
  const [queryStr, setQueryStr] = useState('');

  function handleOnChange(evt) {
    setQueryStr(evt.target.value);
  }

  function handleSubmit(evt) {
    evt.preventDefault();

    if (!queryStr) {
      return;
    }

    const queryStrURI = encodeURIComponent(queryStr);

    navigate('/search?q=' + queryStrURI);
  }

  return (
    <div className="tcl-col-4">
      {/* Header Search */}
      <form onSubmit={handleSubmit}>
        <Input type="search" placeholder="Nhap gia tri search ..." value={queryStr} onChange={handleOnChange} />
      </form>
    </div>
  );
}

export default HeaderSearch;
