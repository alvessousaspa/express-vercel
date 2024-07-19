const { Router } = require('express');
const { SuccessResponseObject } = require('../common/http');
const demo = require('./demo.route');

const r = Router();

r.use('/demo', demo);

r.get('/web-api/auth/session/v2/verifySession', (req, res) => {
  const { traceId } = req.query;
  const data = {
    traceId,
    dt: {
      oj: {
        jid: 0
      },
      pid: "YkJ0gK6mPF",
      pcd: "09001_14330161668455_BRLFIAT_USD",
      tk: "4D8E1AF3-35D7-4957-9D16-8A36804898F5",
      st: 1,
      geu: "game-api/fortune-tiger/",
      lau: "/game-api/lobby/",
      bau: "web-api/game-proxy/",
      cc: "USD",
      cs: "$",
      nkn: "09001_14330161668455_BRLFIAT_USD",
      gm: [
        {
          gid: 126,
          msdt: 1638432092000,
          medt: 1638432092000,
          st: 1,
          amsg: "",
          rtp: {
            df: {
              min: 96.81,
              max: 96.81
            }
          },
          mxe: 2500,
          mxehr: 8960913
        }
      ],
      uiogc: {
        bb: 0,
        grtp: 1,
        gec: 0,
        cbu: 0,
        cl: 0,
        bf: 0,
        mr: 0,
        phtr: 0,
        vc: 0,
        bfbsi: 1,
        bfbli: 1,
        il: 0,
        rp: 0,
        gc: 1,
        ign: 1,
        tsn: 0,
        we: 0,
        gsc: 0,
        bu: 0,
        pwr: 0,
        hd: 0,
        et: 0,
        np: 0,
        igv: 0,
        as: 0,
        asc: 0,
        std: 0,
        hnp: 0,
        ts: 0,
        smpo: 0,
        ivs: 1,
        ir: 0,
        hn: 1
      },
      ec: [],
      occ: {
        rurl: "",
        tcm: "",
        tsc: 0,
        ttp: 0,
        tlb: "",
        trb: ""
      },
      ioph: "a68c2c72c62d"
    },
  };
  res.json(new SuccessResponseObject('Session is valid', data));
});

r.post('/web-api/auth/session/v2/verifyOperatorPlayerSession', (req, res) => {
  const { traceId } = req.query;
  const data = {
    dt: {
        "oj": {
            "jid": 0
        },
        "pid": "YkJ0gK6mPF",
        "pcd": "09001_14330161668455_BRLFIAT_USD",
        "tk": "87BB36E9-F509-4C48-807B-E6123736350D",
        "st": 1,
        "geu": "game-api/fortune-tiger/",
        "lau": "/game-api/lobby/",
        "bau": "web-api/game-proxy/",
        "cc": "USD",
        "cs": "$",
        "nkn": "09001_14330161668455_BRLFIAT_USD",
        "gm": [
            {
                "gid": 126,
                "msdt": 1638432092000,
                "medt": 1638432092000,
                "st": 1,
                "amsg": "",
                "rtp": {
                    "df": {
                        "min": 96.81,
                        "max": 96.81
                    }
                },
                "mxe": 2500,
                "mxehr": 8960913
            }
        ],
        "uiogc": {
            "bb": 0,
            "grtp": 1,
            "gec": 0,
            "cbu": 0,
            "cl": 0,
            "bf": 0,
            "mr": 0,
            "phtr": 0,
            "vc": 0,
            "bfbsi": 1,
            "bfbli": 1,
            "il": 0,
            "rp": 0,
            "gc": 1,
            "ign": 1,
            "tsn": 0,
            "we": 0,
            "gsc": 0,
            "bu": 0,
            "pwr": 0,
            "hd": 0,
            "et": 0,
            "np": 0,
            "igv": 0,
            "as": 0,
            "asc": 0,
            "std": 0,
            "hnp": 0,
            "ts": 0,
            "smpo": 0,
            "ivs": 1,
            "ir": 0,
            "hn": 1
        },
        "ec": [],
        "occ": {
            "rurl": "",
            "tcm": "",
            "tsc": 0,
            "ttp": 0,
            "tlb": "",
            "trb": ""
        },
        "ioph": "70cfc9337c4a"
    },
  };
  res.header('Access-Control-Allow-Origin', 'https://m.sjffdsafãdsfsadfasd.online');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Content-Encoding', 'gzip');
  res.header('Content-Type', 'application/json');
  res.header('Date', 'Fri, 19 Jul 2024 12:51:15 GMT');
  res.header('Server', 'istio-envoy');
  res.header('Set-Cookie', 'aliyungf_tc=485fa4437c5704a3135ab94b6c12215a7988f37385f77c7121772c3af4dac7c2; Path=/; HttpOnly');
  res.header('Vary', 'Accept-Encoding');
  res.header('X-Envoy-Upstream-Service-Time', '660');
  res.header('X-Rate-Limit-Limit', '1s');
  res.header('X-Rate-Limit-Remaining', '1776');
  res.header('X-Rate-Limit-Reset', '2024-07-19T12:51:15.0000000Z');
  res.json(data);
});

r.get('/', (req, res) => res.json(new SuccessResponseObject('express vercel boiler plate')));

module.exports = r;

