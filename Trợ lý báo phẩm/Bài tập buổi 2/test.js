var STATE = { DAYS: ['Thứ 2', 'Thứ 3'], tieuChuan: { 0: {}, 1: {} } };
var tcData = { 'Thứ 2': { sang: 100 }, 'Thứ 3': { trua: 200 } };
for (var i = 0; i < STATE.DAYS.length; i++) {
  var dayName = STATE.DAYS[i];
  if (tcData[dayName]) {
    STATE.tieuChuan[i].sang = tcData[dayName].sang || 0;
    STATE.tieuChuan[i].trua = tcData[dayName].trua || 0;
    STATE.tieuChuan[i].chieu = tcData[dayName].chieu || 0;
  }
}
console.log(STATE.tieuChuan);
