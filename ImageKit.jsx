import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Sun, Moon, FolderOpen, DownloadSimple, Eye, LockSimple, Pause, Play, ArrowCounterClockwise, X, Check, ArrowSquareOut } from '@phosphor-icons/react';
import { FORMATS, MAX_INPUT_BYTES, clamp, cropRect, dimensionsError, downloadName, fileType, bytesLabel } from './image-tools.js';
const Layers = lazy(() => import('./Layers.jsx'));
function Dialog({
  title,
  children,
  close
}) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current.showModal();
    return () => previous?.focus?.();
  }, []);
  return <dialog ref={ref} aria-label={title} onCancel={close} onClick={e => {
    if (e.target === e.currentTarget) close();
  }}><div className="dialog-heading"><h2>{title}</h2><button className="icon-button" onClick={close} aria-label="Close dialog"><X size={22} /></button></div>{children}</dialog>;
}
export default function ImageKit() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('imagekit.theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [source, setSource] = useState(null),
    [name, setName] = useState('pear-study.jpg');
  const [width, setWidth] = useState('1200'),
    [height, setHeight] = useState('1500'),
    [linked, setLinked] = useState(true);
  const [ratio, setRatio] = useState('4:5'),
    [zoom, setZoom] = useState(1.65),
    [panX, setPanX] = useState(55),
    [panY, setPanY] = useState(74);
  const [format, setFormat] = useState('webp'),
    [quality, setQuality] = useState(82),
    [view, setView] = useState(() => innerWidth < 900 ? '2d' : '3d');
  const [flatFit, setFlatFit] = useState(null);
  const [paused, setPaused] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    [rotation, setRotation] = useState(0);
  const [liveReady, setLiveReady] = useState(false),
    [allow3d, setAllow3d] = useState(false),
    [failed3d, setFailed3d] = useState(false);
  const [loading, setLoading] = useState(true),
    [processing, setProcessing] = useState(false),
    [output, setOutput] = useState(null);
  const [error, setError] = useState(''),
    [message, setMessage] = useState(''),
    [dialog, setDialog] = useState(null),
    [dragging, setDragging] = useState(false);
  const fileInput = useRef(null),
    loadId = useRef(0),
    sourceUrl = useRef(null),
    outputUrl = useRef(null),
    previewStage = useRef(null),
    drag = useRef(null);
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#17191b' : '#f0f0e9';
    try {
      localStorage.setItem('imagekit.theme', theme);
    } catch {}
  }, [theme]);
  useEffect(() => {
    if (innerWidth >= 900) {
      const id = setTimeout(() => setAllow3d(true), 650);
      return () => clearTimeout(id);
    }
  }, []);
  const aspect = ratio === 'original' ? source ? source.image.naturalWidth / source.image.naturalHeight : .75 : Number(ratio.split(':')[0]) / Number(ratio.split(':')[1]);
  const crop = useMemo(() => source ? cropRect(source.image.naturalWidth, source.image.naturalHeight, aspect, zoom, panX, panY) : null, [source, aspect, zoom, panX, panY]);
  const invalid = dimensionsError(width, height);
  function reset() {
    setRatio('4:5');
    setZoom(1.65);
    setPanX(55);
    setPanY(74);
    setWidth('1200');
    setHeight('1500');
    setLinked(true);
    setFormat('webp');
    setQuality(82);
    setRotation(0);
    setError('');
    setMessage('Edits reset. Your original is unchanged.');
  }
  async function loadFile(file, sample = false) {
    const id = ++loadId.current;
    setLoading(true);
    setError('');
    setMessage('');
    let url;
    try {
      if (!file || file.size > MAX_INPUT_BYTES) throw new Error('Choose an image under 20 MB.');
      if (!fileType(new Uint8Array(await file.slice(0, 12).arrayBuffer()))) throw new Error('This file is not supported. Choose a JPG, PNG or WebP image.');
      url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      await image.decode();
      if (image.naturalWidth * image.naturalHeight > 32000000) throw new Error('This image is over 32 megapixels. Try a smaller original.');
      if (id !== loadId.current) {
        URL.revokeObjectURL(url);
        return;
      }
      if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
      sourceUrl.current = url;
      setSource({
        image,
        url,
        bytes: file.size,
        sample
      });
      setName(file.name);
      reset();
      if (!sample) {
        setZoom(1);
        setPanX(50);
        setPanY(50);
        setRatio('original');
        const w = Math.min(image.naturalWidth, 1200),
          h = Math.round(w * image.naturalHeight / image.naturalWidth),
          s = Math.min(1, 4096 / h);
        setWidth(String(Math.max(1, Math.round(w * s))));
        setHeight(String(Math.max(1, Math.round(h * s))));
        setView('2d');
      }
      setMessage(sample ? '' : 'Image opened. Your original stays unchanged.');
    } catch (e) {
      if (url && url !== sourceUrl.current) URL.revokeObjectURL(url);
      if (id === loadId.current) setError(e.message || 'The image could not be opened. Try another file.');
    } finally {
      if (id === loadId.current) setLoading(false);
    }
  }
  async function loadSample() {
    const id = ++loadId.current;
    setLoading(true);
    try {
      const r = await fetch('./pear-study.jpg');
      if (!r.ok) throw new Error();
      const b = await r.blob();
      if (id === loadId.current) await loadFile(new File([b], 'pear-study.jpg', {
        type: 'image/jpeg'
      }), true);
    } catch {
      if (id === loadId.current) {
        setLoading(false);
        setError('The sample could not load. Open your own image to continue.');
      }
    }
  }
  useEffect(() => {
    loadSample();
    return () => {
      loadId.current++;
      if (sourceUrl.current) URL.revokeObjectURL(sourceUrl.current);
      if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
    };
  }, []);
  useEffect(() => {
    if (view !== '2d' || !source || !previewStage.current) return;
    const box = previewStage.current.parentElement;
    function fit() {
      const r = box.getBoundingClientRect(),
        s = Math.min((r.width - 32) / source.image.naturalWidth, (r.height - 32) / source.image.naturalHeight);
      setFlatFit({
        width: source.image.naturalWidth * s,
        height: source.image.naturalHeight * s
      });
    }
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    fit();
    return () => ro.disconnect();
  }, [view, source]);
  useEffect(() => {
    let stale = false;
    if (!source || invalid) {
      setOutput(null);
      setProcessing(false);
      return;
    }
    setProcessing(true);
    setOutput(null);
    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Number(width);
        canvas.height = Number(height);
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Your browser could not create a preview.');
        if (format === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(source.image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
          if (stale) return;
          if (!blob || blob.type !== FORMATS[format].mime) {
            setProcessing(false);
            setError('Your browser cannot export this format. Choose PNG or JPG.');
            return;
          }
          const url = URL.createObjectURL(blob);
          if (outputUrl.current) URL.revokeObjectURL(outputUrl.current);
          outputUrl.current = url;
          setOutput({
            blob,
            url,
            width: canvas.width,
            height: canvas.height
          });
          setProcessing(false);
        }, FORMATS[format].mime, quality / 100);
      } catch (e) {
        if (!stale) {
          setProcessing(false);
          setError(e.message || 'The export could not be prepared. Try smaller dimensions.');
        }
      }
    }, 140);
    return () => {
      stale = true;
      clearTimeout(timer);
    };
  }, [source, crop, width, height, format, quality, invalid]);
  function changeRatio(v) {
    setRatio(v);
    const a = v === 'original' ? source?.image.naturalWidth / source?.image.naturalHeight || .75 : Number(v.split(':')[0]) / Number(v.split(':')[1]);
    if (linked && Number(width) > 0) setHeight(String(Math.max(1, Math.round(Number(width) / a))));
    setError('');
  }
  function changeSize(axis, v) {
    setError('');
    if (axis === 'width') {
      setWidth(v);
      if (linked && v !== '') setHeight(String(Math.max(1, Math.round(Number(v) / aspect))));
    } else {
      setHeight(v);
      if (linked && v !== '') setWidth(String(Math.max(1, Math.round(Number(v) * aspect))));
    }
  }
  function download() {
    if (!output || processing || invalid) return;
    const a = document.createElement('a');
    a.href = output.url;
    a.download = downloadName(name, format);
    document.body.append(a);
    a.click();
    a.remove();
    setMessage('Download requested. Your original is unchanged.');
  }
  function pointerStart(e) {
    if (!source || view !== '2d' || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      panX,
      panY
    };
  }
  function pointerMove(e) {
    if (!drag.current || !previewStage.current || !crop) return;
    const r = previewStage.current.getBoundingClientRect(),
      s = Math.min(r.width / source.image.naturalWidth, r.height / source.image.naturalHeight);
    setPanX(clamp(drag.current.panX + (e.clientX - drag.current.x) / s / Math.max(1, source.image.naturalWidth - crop.width) * 100, 0, 100));
    setPanY(clamp(drag.current.panY + (e.clientY - drag.current.y) / s / Math.max(1, source.image.naturalHeight - crop.height) * 100, 0, 100));
  }
  function keyboardCrop(e) {
    const d = e.shiftKey ? 10 : 2;
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      if (e.key === 'ArrowLeft') setPanX(x => clamp(x - d, 0, 100));
      if (e.key === 'ArrowRight') setPanX(x => clamp(x + d, 0, 100));
      if (e.key === 'ArrowUp') setPanY(y => clamp(y - d, 0, 100));
      if (e.key === 'ArrowDown') setPanY(y => clamp(y + d, 0, 100));
    }
  }
  const cropStyle = crop ? {
    left: crop.x / source.image.naturalWidth * 100 + '%',
    top: crop.y / source.image.naturalHeight * 100 + '%',
    width: crop.width / source.image.naturalWidth * 100 + '%',
    height: crop.height / source.image.naturalHeight * 100 + '%'
  } : {};
  return <>
  <a className="skip-link" href="#export-settings">Skip to export settings</a>
  <header className="topbar"><a className="brand" href="#studio">ImageKit</a><nav aria-label="Main navigation"><a href="#studio" className="active">Studio</a><button onClick={() => setDialog('help')}>How it works</button></nav><div className="header-actions"><button className="icon-button" aria-label={'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' theme'} onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? <Sun size={23} /> : <Moon size={23} />}</button><button className="open-button" aria-label="Open image" onClick={() => fileInput.current.click()} disabled={loading}><FolderOpen size={21} /><span>Open image</span></button></div></header>
  <main id="studio" className="studio" onDragOver={e => {
      e.preventDefault();
      setDragging(true);
    }} onDragLeave={e => {
      if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
    }} onDrop={e => {
      e.preventDefault();
      setDragging(false);
      if (e.dataTransfer.files.length > 1) {
        setError('Open one image at a time.');
        return;
      }
      if (e.dataTransfer.files[0]) loadFile(e.dataTransfer.files[0]);
    }}>
   <section className="image-workspace" aria-label="Image workspace">
    <div className="intro"><div><h1>A better frame.</h1><p>Resize, crop and export. All on your device.</p></div><div className="view-switch" aria-label="Preview view">{['2d', '3d'].map(v => <button key={v} aria-pressed={view === v} onClick={() => {
              setView(v);
              if (v === '3d') setAllow3d(true);
            }} disabled={v === '3d' && failed3d}>{v === '2d' ? '2D' : '3D'}</button>)}</div></div>
    <div className={'image-stage ' + (view === '2d' ? 'flat-mode' : 'layer-mode')}>
     {view === '3d' ? <><div className={'layers-poster ' + (liveReady && !failed3d ? 'poster-hidden' : '')}><img src="./layers-poster.webp" alt="Sample demonstration of original, crop and export image planes" /></div>{source && allow3d && !failed3d && <Suspense fallback={null}><Layers source={source} crop={crop} output={output} paused={paused} rotation={rotation} theme={theme} onReady={() => setLiveReady(true)} onFailure={() => {
                setFailed3d(true);
                setView('2d');
                setMessage('3D is unavailable in this browser. Your image tools work in 2D.');
              }} /></Suspense>}{!allow3d && <button className="enable-3d" onClick={() => setAllow3d(true)}>Explore in 3D</button>}</> : source ? <div className="flat-wrap"><div className="flat-image" ref={previewStage} style={{
              aspectRatio: source.image.naturalWidth + '/' + source.image.naturalHeight,
              ...flatFit
            }} onPointerDown={pointerStart} onPointerMove={pointerMove} onPointerUp={() => {
              drag.current = null;
            }} onPointerCancel={() => {
              drag.current = null;
            }}><img src={source.url} alt={source.sample ? 'Sample photograph of a pear on a concrete plinth' : 'Your original image'} draggable="false" /><div className="crop-selection" style={cropStyle} tabIndex="0" role="group" aria-label="Crop frame. Use arrow keys to move, or the crop controls below." onKeyDown={keyboardCrop}><span /><span /><span /><span /><div className="crop-grid" /></div></div></div> : <div className="empty-image"><FolderOpen size={38} /><h2>{loading ? 'Opening image…' : 'Your next image starts here.'}</h2><p>Open a JPG, PNG or WebP, or try the sample.</p><button onClick={loadSample}>Try sample</button></div>}
     {loading && source && <div className="stage-loading" role="status">Opening image…</div>}
     {view === '3d' && <div className="plane-labels" aria-hidden="true"><span>Original</span><span>Crop</span><span>Export</span></div>}
    </div>
    <div className="stage-controls">{view === '3d' ? <><button className="round-button" disabled={!liveReady || !allow3d || failed3d} aria-label={paused ? 'Play layer motion' : 'Pause layer motion'} onClick={() => setPaused(v => !v)}>{paused ? <Play size={20} /> : <Pause size={20} />}</button><button className="round-button" disabled={!liveReady || !allow3d || failed3d} aria-label="Rotate layers" onClick={() => setRotation(v => (v + 1) % 5)}><ArrowCounterClockwise size={20} /></button></> : <div className="crop-controls"><label>Crop zoom <input aria-label="Crop zoom" type="range" min="1" max="4" step=".01" value={zoom} onChange={e => setZoom(Number(e.target.value))} /><output>{zoom.toFixed(2)}×</output></label><label>Horizontal <input aria-label="Horizontal crop position" type="range" min="0" max="100" value={panX} onChange={e => setPanX(Number(e.target.value))} /></label><label>Vertical <input aria-label="Vertical crop position" type="range" min="0" max="100" value={panY} onChange={e => setPanY(Number(e.target.value))} /></label></div>}</div>
    <div className="image-meta"><span>{source?.sample ? 'Sample · Pear study' : source ? name : 'JPG, PNG or WebP · up to 20 MB'}</span><span>{width && height ? `${width} × ${height} px` : 'Set export dimensions'}</span></div>
   </section>
   <aside className="settings-rail" id="export-settings" aria-label="Export settings"><div className="settings-body"><h2>Export settings</h2>
    <label className="field filename">File name<input value={name} onChange={e => setName(e.target.value)} maxLength="120" /></label>
    <div className="dimensions"><label className="field">Width (px)<input type="number" min="1" max="4096" step="1" inputMode="numeric" value={width} onChange={e => changeSize('width', e.target.value)} /></label><label className="field">Height (px)<input type="number" min="1" max="4096" step="1" inputMode="numeric" value={height} onChange={e => changeSize('height', e.target.value)} /></label></div>
    <label className="check-field"><input type="checkbox" checked={linked} onChange={e => {
              setLinked(e.target.checked);
              if (e.target.checked) setHeight(String(Math.max(1, Math.round(Number(width) / aspect))));
            }} />Keep proportions</label>
    <label className="field ratio">Crop ratio<select value={ratio} onChange={e => changeRatio(e.target.value)}><option value="original">Original</option><option value="1:1">1:1 · Square</option><option value="4:5">4:5</option><option value="3:2">3:2</option><option value="16:9">16:9</option><option value="9:16">9:16</option></select></label>
    <fieldset className="format"><legend>Output format</legend><div className="format-options">{Object.entries(FORMATS).map(([key, v]) => <button key={key} aria-pressed={format === key} onClick={() => {
                setFormat(key);
                setError('');
              }}>{v.label}</button>)}</div></fieldset>
    <label className="quality">Quality<div><input aria-label="Export quality" type="range" min="10" max="100" step="1" value={quality} disabled={format === 'png'} onChange={e => setQuality(Number(e.target.value))} /><output>{format === 'png' ? 'Lossless' : quality + '%'}</output></div></label>
    <button className="preview-button" disabled={!output || processing} onClick={() => setDialog('preview')}><Eye size={24} /><span>Preview before you download.</span></button>
    <button className="download-button" onClick={download} disabled={!output || processing || loading || !!invalid}><DownloadSimple size={24} />{processing ? 'Preparing image…' : 'Download image'}</button><button className="reset-button" onClick={reset} disabled={!source}>Reset edits</button>
    {(invalid || error) && <p className="error" role="alert">{invalid || error}</p>}
   </div><footer className="rail-footer"><LockSimple size={16} /><span>Images stay on your device.</span><span>Portfolio concept by Thomas Ginting</span></footer></aside>
   {dragging && <div className="drop-overlay"><FolderOpen size={44} /><strong>Drop one image to open it</strong><span>JPG, PNG or WebP · up to 20 MB</span></div>}
  </main>
  <input className="file-input" tabIndex="-1" ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Open an image file" onChange={e => {
      if (e.target.files?.[0]) loadFile(e.target.files[0]);
      e.target.value = '';
    }} />
  {message && <div className="toast" role="status"><Check size={19} />{message}<button aria-label="Dismiss notification" onClick={() => setMessage('')}><X size={18} /></button></div>}
  {dialog === 'preview' && output && <Dialog title="Your export" close={() => setDialog(null)}><img className="export-preview" src={output.url} alt="Preview of your downloadable image" /><div className="preview-details"><strong>{downloadName(name, format)}</strong><span>{output.width} × {output.height} px · {bytesLabel(output.blob.size)}</span></div><p className="muted">{format === 'jpeg' ? 'JPG exports use a white background for transparent areas.' : format === 'png' ? 'PNG preserves transparency and uses lossless compression.' : 'WebP preserves transparent areas.'} {crop && (Number(width) > crop.width || Number(height) > crop.height) ? 'This export enlarges the cropped area; fine detail may soften.' : ''}</p><button className="download-button" onClick={download}><DownloadSimple size={22} />Download image</button></Dialog>}
  {dialog === 'help' && <Dialog title="Make your image ready." close={() => setDialog(null)}><div className="help-copy"><p>Open one JPG, PNG or WebP, or explore the generated pear sample. Your original stays unchanged.</p><h3>Frame it in 2D</h3><p>Choose a crop ratio. Use the zoom and position controls, drag the crop frame, or focus it and use the arrow keys. Hold Shift for larger steps.</p><h3>Choose your export</h3><p>Set dimensions up to 4,096 pixels per side and 16 megapixels in total. Keep proportions on to avoid stretching. Preview shows the exact dimensions and file size before downloading.</p><h3>Local, from start to finish</h3><p>Your photos are processed in this browser and are never uploaded. Reloading clears the image session. Only your theme preference is saved. Animated files export a single still frame; metadata is not copied.</p><p>JPG uses a white background for transparency. PNG is lossless; the quality slider applies to JPG and WebP. File size can increase for some images.</p><div className="help-actions"><button className="open-button" onClick={() => {
            setDialog(null);
            loadSample();
          }}>Restore sample</button><a href="https://github.com/Jokojoyo/imagekit-studio" target="_blank" rel="noreferrer">View source<ArrowSquareOut size={17} /></a></div><small>ImageKit is an independent portfolio concept by Thomas Ginting. Sample image generated for this project.</small></div></Dialog>}
 </>;
}
