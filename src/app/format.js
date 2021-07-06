export const formatDate = (dateStr) => {
  

  if (dateStr)  {

    validateDate(dateStr);

    console.log('dateStr AFTER VALID==', dateStr);  

   /*  const date = new Date(dateStr);  // => Thu Jan 23 2020 01:00:00 GMT+0100 (Central European Standard Time)
    const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
    const mo = new Intl.DateTimeFormat('fr', { month: 'short' }).format(date)
    const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
    const month = mo.charAt(0).toUpperCase() + mo.slice(1)
    
    console.log('date==', date);
    console.log('mo==', mo);
    console.log('da==', da);
    console.log('month==', month);
    console.log('parsed==',`${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`); */

    //return `${parseInt(da)} ${month.substr(0,3)}. ${ye.toString().substr(2,4)}`
    return dateStr
  
  } else { return dateStr = '*ERROR DATE*'}

  function validateDate(dateStr) {
      // 2021-06-23
      let dateRegex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i;
      // check date format;
      dateStr.match(dateRegex)? dateStr: 'XXXX';

      let datevalues = dateStr.split(/[\.\-\/]/);
      
      // check year is at index 0
      let year = datevalues.filter(n => n.length === 4); console.log('YEAR+++', year)
      let yearCurrentIndex = datevalues.indexOf(year.toString());console.log('YEAR INDEX ===== ', yearCurrentIndex)
      
      if ( !yearCurrentIndex == 0) {

        let temp = year;
        datevalues.splice(yearCurrentIndex, 1);
        datevalues.splice(0, 0, temp);

        (datevalues[0] >= 1990 && datevalues[0] <= 2021) ? datevalues[0]: '*ERROR DATE*';

        console.log('MODIFIED:',datevalues.join('-'));
      }

      return datevalues.join('-')

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