import * as https from "https";
import * as request from "supertest";
import { JsonBody, Routex, TextBody } from "../src";

it("Handles listen on random port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen();

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Handles listen on assigned port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen(9999);

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Handles listen on assigned string port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  const { close, port } = await app.listen("9998");

  await request(`http://localhost:${port}`)
    .get("/")
    .expect("Content-Type", /json/)
    .expect("Content-Length", "15")
    .expect(200);

  await close();
});

it("Catches listen on invalid port", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  await expect(app.listen("invalid port")).rejects.toThrow();
});

it("Catches listen on invalid hostname", async () => {
  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new JsonBody({ name: "john" });
  });

  // @ts-ignore
  await expect(app.listen(undefined, { hostname: 1 })).rejects.toThrow();
});

it("Handles HTTPS listen", async () => {
  const cert =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIICDDCCAXUCFEUWy6v/qRyAS3YPEQOZ/WXprb8BMA0GCSqGSIb3DQEBCwUAMEUx\n" +
    "CzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRl\n" +
    "cm5ldCBXaWRnaXRzIFB0eSBMdGQwHhcNMTkwNTI0MDEzMTE1WhcNMTkwNjIzMDEz\n" +
    "MTE1WjBFMQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UE\n" +
    "CgwYSW50ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIGfMA0GCSqGSIb3DQEBAQUAA4GN\n" +
    "ADCBiQKBgQDjedX66npkrGgXSfiPz955CgsjXGPM2fVZ0mclV0rIbbbelnTXfUMn\n" +
    "x1r2+NR43Qh+uhOxZn/SpyF3bYGDhzZFNyAeSBlvWOKT6NU7ZYcqvT+nkIveiDBf\n" +
    "MxcaZJ94NDsTFSf4t+UZp4DPUtThWKXn7VNIGf88Uvq9edYFNWlY/QIDAQABMA0G\n" +
    "CSqGSIb3DQEBCwUAA4GBADKJ3TIDGf632Sh9RlbzFNLnHCnZX5ljKrLbFQqs8qYX\n" +
    "4M3hwf+29gLS+8s+0q1eb3PkQcP6Bfl/ob7G8ThpV9EhIpxnjfle906u98KZTSz2\n" +
    "0bUUiTWM2qWYXh/g1UFdEzFVzTjZknsfYOG61uCt4vNT/hpVZ5qLWMD3gCuc1mRC\n" +
    "-----END CERTIFICATE-----\n";

  const key =
    "-----BEGIN RSA PRIVATE KEY-----\n" +
    "MIICXAIBAAKBgQDjedX66npkrGgXSfiPz955CgsjXGPM2fVZ0mclV0rIbbbelnTX\n" +
    "fUMnx1r2+NR43Qh+uhOxZn/SpyF3bYGDhzZFNyAeSBlvWOKT6NU7ZYcqvT+nkIve\n" +
    "iDBfMxcaZJ94NDsTFSf4t+UZp4DPUtThWKXn7VNIGf88Uvq9edYFNWlY/QIDAQAB\n" +
    "AoGBAMq17gv2HC/Ou8vVLV3q3dR7MMXINV998/ihWS2bhpbpvobJCUJm7AtsyhFA\n" +
    "WQeD4WgdJiN2tf3g1h/5Q+sT+TUyU65B231lCHeQAFEoswwhDf3jjVTNDZSsyC5b\n" +
    "TCBrgdgxsf33B1131WJSuWn198oRa41L1RQq+f1p4AFQ/915AkEA/wo2i/fMTDCj\n" +
    "wE4tShncuuPxPDUJX8g8uzbGj0N0oH5r9N3XVrVQq3DaAvhnkr3GmRocp/2nqH9B\n" +
    "SznSIuG+vwJBAORVDxCcD2NAIiUJ9Mr5Eg+sra/29QYHx5k69DLNiWv6bNinsQCE\n" +
    "kR3+tpW5pp46ra43Z4ks3M7R9ZXrwxAj00MCQGUzE0Pk9u8AmemT28q8imaqTi3a\n" +
    "ybZ1CQwshwuP87Y/k+zdHjZsye7NX+Sv1sFWhnh38QkD0MQ+gpUsA2MN+pcCQHiv\n" +
    "vNa6pid/royFRq5CGBnQ2702eyxE0GtdjdWMbiZ0pzOc7yGm8E06ZKefCUJ5IXQE\n" +
    "NOV8oPlwYK5tfxz40qECQFCT15Ea29Tj6tWXLpsE5Yfz13vg4SRIgid3Lbw8AXVw\n" +
    "AABnT6DJ/GrtSZSQEabq0Pp4LW8R34kKviJ2sTppKWo=\n" +
    "-----END RSA PRIVATE KEY-----\n";

  const ca =
    "-----BEGIN CERTIFICATE-----\n" +
    "MIICZjCCAc+gAwIBAgIUM4aLYYcozD+E1yvvI5K4nXsepx0wDQYJKoZIhvcNAQEL\n" +
    "BQAwRTELMAkGA1UEBhMCQVUxEzARBgNVBAgMClNvbWUtU3RhdGUxITAfBgNVBAoM\n" +
    "GEludGVybmV0IFdpZGdpdHMgUHR5IEx0ZDAeFw0xOTA1MjQwMTMwMzFaFw0yMjAz\n" +
    "MTMwMTMwMzFaMEUxCzAJBgNVBAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEw\n" +
    "HwYDVQQKDBhJbnRlcm5ldCBXaWRnaXRzIFB0eSBMdGQwgZ8wDQYJKoZIhvcNAQEB\n" +
    "BQADgY0AMIGJAoGBALL0WFJaTFQaEeKA1F4oOspym/LrSx9vqckm4vPL+C9pBm9T\n" +
    "oXrLH3emhdaK61UurNxz4KGpBpYh3QzsM/jrVzagodHqGDsXhBtlA01wAxnvjlRn\n" +
    "Qt6kBokI4ujo8TzMDE5dbAZDUP0Yc0RwCFGaIZMIHkL6q31dUpT5yZo665FbAgMB\n" +
    "AAGjUzBRMB0GA1UdDgQWBBTXA4DKDPdo39lHd2ZXQd0LPUCZTjAfBgNVHSMEGDAW\n" +
    "gBTXA4DKDPdo39lHd2ZXQd0LPUCZTjAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3\n" +
    "DQEBCwUAA4GBAFlR5jdtEF2ApvgZEn/OmNoOlV3wJYpdTeyo1nDN3Pc8W6V/hESh\n" +
    "efVfs/uM2zJUDD6JVQmnXj7sCCnTWY03l2omPmriLAqL9Ru3g4z10D0GtznFhMcV\n" +
    "3E34001QZLqXTnmYW8nUlyvD112j+L378PDYiM4XiuTpcODo/IGvLxsm\n" +
    "-----END CERTIFICATE-----\n";

  const app = new Routex();

  app.get("/", ctx => {
    ctx.body = new TextBody("john");
  });

  const { close, port } = await app.listen(undefined, {
    https: {
      ca,
      cert,
      key,
      rejectUnauthorized: false
    }
  });

  await request(`https://localhost:${port}`)
    .get("/")
    .agent(new https.Agent({ rejectUnauthorized: false, ca, key, cert }))
    .expect("john");

  await close();
});
