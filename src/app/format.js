export const formatDate = (dateStr) => {
  validateDate(dateStr);

  if (dateStr)  {
    console.log('dateStr==', dateStr);

    const date = new Date(dateStr);
    const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
    const month = mo.charAt(0).toUpperCase() + mo.slice(1)
    
    console.log('date==', date);
    console.log('mo==', mo);
    console.log('da==', da);
    console.log('month==', month);
    console.log('parsed==',`${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`);

    //return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
    return dateStr
  }

  function validateDate(dateStr) {
      // 2021-06-23
      let dateRegex = /^(19|20){1}\d\d{2}[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i;
      return dateRegex.test(dateStr)? dateStr: 'XXXX';
  }

}

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}