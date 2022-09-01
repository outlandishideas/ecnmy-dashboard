const BASE_URI = 'https://api.datawrapper.de/v3';

/**
 * @returns body JSON if applicable; `true` if not (e.g. data PUT); undefined on error.
 */
export async function callDWAndLogErrors(endpoint, method, body, isCSV = false) {
  const response = await fetch(`${BASE_URI}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.DATAWRAPPER_API_KEY}`,
      'content-type': isCSV ? 'text/csv' : 'application/json',
    },
    body,
  })
  .catch(err => {
    console.log(`Uncaught error calling DataWrapper ${method} ${endpoint}: ${err}`);

    return undefined;
  });

  if (response.status >= 400) {
    console.log(`Error HTTP code calling DataWrapper ${method} ${endpoint}: ${response.status} (${response.statusText}). Body: ${JSON.stringify(await response.json())}`);

    return undefined;
  }

  if (isCSV) {
    return true; // https://developer.datawrapper.de/reference/putchartsiddata just returns 204 with no data.
  }

  const data = await response.json();

  return data;
}
