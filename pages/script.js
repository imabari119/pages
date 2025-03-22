function getDateFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const dateParam = urlParams.get("date");
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    return dateParam;
  } else {
    return null;
  }
}
function getDateTime(hoursOffset, minutesOffset) {
  const now = new Date();
  now.setHours(now.getHours() + hoursOffset);
  now.setMinutes(now.getMinutes() + minutesOffset);
  return now.toISOString().split("T")[0];
}
async function fetchHospitalData() {
  try {
    const response = await fetch("data.json", { cache: "default" });
    return await response.json();
  } catch (error) {
    console.error("Error fetching the JSON data:", error);
    return {};
  }
}
function createHospitalCard(hospital) {

  return `<div class="column is-12-tablet is-8-desktop is-offset-2-desktop"><div class="card"><div class="card-content"><h3 class="subtitle is-5"><a href=${hospital.link} target="_blank">${hospital.name}</a></h3><div class="content"><p><span class="tag is-danger"><i class="fas fa-medkit"></i>診療</span><span class="text">${hospital.medical}</span></p><p><span class="tag is-danger"><i class="far fa-clock"></i>時間</span><span class="text">${hospital.time}</span></p><p><span class="tag is-danger"><i class="fas fa-map-marker-alt"></i>住所</span><span class="text"><a href="${hospital.navi}">${hospital.address}</a></span></p><p><span class="tag is-danger"><i class="fas fa-phone"></i>電話</span><span class="text"><a href="tel:${hospital.daytime}">${hospital.daytime}</a></span></p></div></div></div></div>`;
}
function renderHospitals(hospitalData, dates) {
  const mainElement = document.getElementById("hospitalList");
  let html = "";
  dates.forEach((date) => {
    const dayData = hospitalData[date];
    if (dayData) {
      html += `<h2 class="title is-4 has-text-centered">${dayData.date_week}</h2><div class="columns is-multiline"> ${dayData.hospitals
        .map(createHospitalCard)
        .join("")} </div>`;
    } else {
      html += `<p class="date">${date}の当番医情報はありません。<br><a href="https://www.iryou.teikyouseido.mhlw.go.jp/znk-web/juminkanja/S2310/initialize?pref=38">えひめ医療情報ネット</a>をご確認ください</p>`;
    }
  });
  mainElement.innerHTML = html;
}
async function initPage() {
  const specifiedDate = getDateFromURL();
  const todayDate = getDateTime(0, 30);
  const tomorrowDate = getDateTime(15, 0);
  const hospitalData = await fetchHospitalData();
  if (specifiedDate) {
    renderHospitals(hospitalData, [specifiedDate]);
  } else if (todayDate === tomorrowDate) {
    renderHospitals(hospitalData, [todayDate]);
  } else {
    renderHospitals(hospitalData, [todayDate, tomorrowDate]);
  }
}
document.addEventListener("DOMContentLoaded", initPage);
