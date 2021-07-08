export const formatDate = (dateStr) => {
  
  if ( dateStr && !dateStr=='')  {
      // check date format;
      let dateRegex = /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i;
      dateRegex.test(dateStr)? dateStr: dateStr = '2021-03-03';

      let datevalues = dateStr.split(/[\.\-\/]/);
      
      // check year is at index 0
      let year = datevalues.filter(n => n.length === 4);
      if ( year.length > 0) {
        
        let parsedYear = parseInt(year);
  
        if ( parsedYear < 1990 || parsedYear > 2021 ) { dateStr = '2021-03-03'; } else { 
          
            let yearCurrentIndex = datevalues.indexOf(year.toString());
            
            if ( !yearCurrentIndex == 0) {
              let temp = year;
              datevalues.splice(yearCurrentIndex, 1);
              datevalues.splice(0, 0, temp);
            }
            datevalues.join('-');
        }
        
      } else { dateStr = '2021-03-03';}


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
  
  } else { dateStr = '*ERROR DATE*'; }
  
  return dateStr;
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