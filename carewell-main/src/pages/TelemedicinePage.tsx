import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, 
  Paperclip, Send, HeartPulse, Activity, ShieldCheck, 
  Volume2, VolumeX, Sparkles, User
} from 'lucide-react';
import { dataService } from '@/services/dataService';

export function TelemedicinePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = dataService.orders.getById(id || '');

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(134);
  const [cameraActive, setCameraActive] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { sender: 'doctor', text: 'Hello! I am reviewing your blood pressure readings and current symptoms.', time: '10:02 AM' },
    { sender: 'patient', text: 'Good morning Doctor. The morning readings have been slightly elevated around 135/88.', time: '10:03 AM' },
    { sender: 'doctor', text: 'Understood. Let us review your salt intake and current dosage of Telmisartan.', time: '10:04 AM' },
  ]);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  // Extract doctor name from order title
  const doctorName = order?.title.replace('Consultation with ', '') || 'Dr. Ramesh Menon';

  // Elapsed timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Attempt real camera stream
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (!isVideoOff && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(() => {
          setCameraActive(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOff]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: 'patient',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Simulated doctor response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'doctor',
          text: 'Noted. I am formulating your updated digital prescription now.',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1500);
  };

  const endCall = () => {
    navigate(`/telemedicine/${id}/prescription`);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-slate-950 text-white sm:flex-row overflow-hidden font-sans">
      {/* Video Area */}
      <div className="relative flex flex-1 flex-col p-3 sm:p-4 bg-slate-950 justify-between">
        {/* Header HUD */}
        <div className="z-10 flex items-center justify-between gap-3 rounded-2xl bg-slate-900/80 px-4 py-2.5 backdrop-blur-md border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white font-bold shadow-xs">
              {doctorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">{doctorName}</h2>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Encrypted HD
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Cardiology &bull; Teleconsultation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-xs text-slate-300 font-mono bg-slate-800/60 px-3 py-1.5 rounded-xl border border-slate-700/50">
              <span className="flex items-center gap-1 text-emerald-400">
                <HeartPulse size={14} /> 74 bpm
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 text-cyan-400">
                <Activity size={14} /> 99% SpO2
              </span>
            </div>
            <div className="font-mono text-xs font-bold bg-red-600/20 border border-red-500/30 text-red-300 px-2.5 py-1 rounded-xl">
              {formatTimer(secondsElapsed)}
            </div>
          </div>
        </div>

        {/* Main Video View (Doctor Stream) */}
        <div className="relative flex-1 my-3 overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 flex items-center justify-center">
          {/* Doctor Video Canvas Simulation */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Visual avatar backdrop with ambient lighting */}
            <div className="absolute inset-0 bg-radial from-emerald-900/20 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col items-center text-center p-6">
              <div className="relative">
                <div className="h-32 w-32 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-700 to-slate-800 flex items-center justify-center text-5xl font-black text-white shadow-2xl ring-4 ring-emerald-500/30">
                  {doctorName.replace('Dr. ', '').charAt(0)}
                </div>
                <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md">
                  <ShieldCheck size={18} />
                </div>
              </div>

              <h3 className="mt-4 text-lg font-bold text-white">{doctorName}</h3>
              <p className="text-xs text-emerald-400 font-medium">Listening to Patient History...</p>

              {/* Animated audio wave */}
              <div className="flex items-center gap-1 mt-4">
                {[4, 12, 8, 16, 10, 6, 14, 10, 5].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h * 1.5}px` }}
                    className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* PIP Video (Patient Camera View) */}
          <div className="absolute bottom-4 right-4 h-44 w-32 overflow-hidden rounded-2xl bg-slate-800 shadow-2xl ring-2 ring-slate-700/80 sm:bottom-6 sm:right-6 sm:h-48 sm:w-36">
            {isVideoOff ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-2 text-center text-slate-500">
                <VideoOff size={22} />
                <span className="text-[10px] mt-1">Camera Paused</span>
              </div>
            ) : cameraActive ? (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="h-full w-full object-cover transform -scale-x-100"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-900 p-2 text-center text-slate-400">
                <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 font-bold mb-1">
                  You
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Self Preview</span>
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
              You
            </div>
          </div>
        </div>

        {/* Floating Controls Bar */}
        <div className="z-10 flex items-center justify-center gap-3 rounded-2xl bg-slate-900/90 p-3 backdrop-blur-xl border border-slate-800 self-center">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
              isMuted ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
              isVideoOff ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Start Camera' : 'Pause Camera'}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button
            type="button"
            onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
              isSpeakerMuted ? 'bg-slate-700 text-amber-400' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Speaker Volume"
          >
            {isSpeakerMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>

          <button
            type="button"
            onClick={() => setShowChat(!showChat)}
            className={`flex h-12 w-12 items-center justify-center rounded-2xl transition ${
              showChat ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
            }`}
            title="Toggle Clinical Chat"
          >
            <MessageSquare size={20} />
          </button>

          <button
            type="button"
            onClick={endCall}
            className="flex items-center gap-2 rounded-2xl bg-red-600 px-5 py-3 font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition active:scale-95 ml-2"
          >
            <PhoneOff size={18} />
            <span className="text-xs">End & Prescribe</span>
          </button>
        </div>
      </div>

      {/* Side Panel: Live Consultation Chat */}
      <div className={`${showChat ? 'flex' : 'hidden'} w-full flex-col border-l border-slate-800 bg-slate-900 sm:flex sm:w-80 lg:w-96`}>
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-emerald-500" />
            <h4 className="text-xs font-bold text-white">Consultation Messaging</h4>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            Secure Channel
          </span>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col max-w-[85%] ${msg.sender === 'patient' ? 'ml-auto items-end' : 'items-start'}`}
            >
              <div
                className={`rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'patient'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="border-t border-slate-800 p-3 bg-slate-900/90">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-800 p-1.5 border border-slate-700">
            <button
              type="button"
              className="p-2 text-slate-400 hover:text-white transition"
              title="Attach Report"
            >
              <Paperclip size={16} />
            </button>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask doctor or share symptoms..."
              className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-40"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
