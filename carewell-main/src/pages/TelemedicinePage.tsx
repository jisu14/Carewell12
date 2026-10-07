import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Paperclip, FileText, Activity, Speaker } from 'lucide-react';
import { dataService } from '@/services/dataService';

export function TelemedicinePage() {
  const { id } = useParams(); // mock order id
  const navigate = useNavigate();
  const order = dataService.orders.getById(id || '');

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Extract doctor name from order title (format: "Consultation with Dr. Name")
  const doctorName = order?.title.replace('Consultation with ', '') || 'Doctor';

  const endCall = () => {
    // Navigate to prescription page as doctor perspective, or just an end screen.
    // Assuming we want to show the prescription interface next since it's a demo.
    navigate(`/telemedicine/${id}/prescription`);
  };

  return (
    <div className="flex h-screen w-full flex-col bg-neutral-900 text-white sm:flex-row">
      {/* Video Area */}
      <div className="relative flex flex-1 flex-col p-4">
        {/* Header */}
        <div className="absolute left-6 top-6 z-10 rounded-xl bg-black/40 px-4 py-2 backdrop-blur-md">
          <h2 className="font-semibold text-white">{doctorName}</h2>
          <p className="text-xs text-neutral-300">04:23</p>
        </div>

        {/* Main Video (Doctor) */}
        <div className="relative h-full w-full overflow-hidden rounded-3xl bg-neutral-800">
          <div className="flex h-full w-full items-center justify-center text-neutral-600">
            <span className="text-lg">Doctor Video Feed Placeholder</span>
          </div>
        </div>

        {/* PIP Video (Patient) */}
        <div className="absolute bottom-28 right-8 h-48 w-32 overflow-hidden rounded-2xl bg-neutral-700 shadow-2xl ring-4 ring-neutral-900 sm:bottom-8 sm:h-40 sm:w-28">
          {isVideoOff ? (
            <div className="flex h-full w-full items-center justify-center bg-neutral-800">
              <VideoOff className="text-neutral-500" />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-neutral-500">
              You
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-full bg-neutral-800/80 px-6 py-3 backdrop-blur-lg">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isMuted ? 'bg-error-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </button>
          
          <button 
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${isVideoOff ? 'bg-error-500 text-white' : 'bg-neutral-700 hover:bg-neutral-600'}`}
          >
            {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
          </button>

          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-700 hover:bg-neutral-600 transition-colors">
            <Speaker size={20} />
          </button>
          
          <button 
            onClick={() => setShowChat(!showChat)}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors sm:hidden ${showChat ? 'bg-primary-600' : 'bg-neutral-700'}`}
          >
            <MessageSquare size={20} />
          </button>

          <button onClick={endCall} className="flex h-12 w-12 items-center justify-center rounded-full bg-error-500 hover:bg-error-600 transition-colors ml-4">
            <PhoneOff size={20} />
          </button>
        </div>
      </div>

      {/* Side Panel (Chat / Records) */}
      <div className={`${showChat ? 'flex' : 'hidden'} w-full flex-col border-l border-neutral-800 bg-neutral-900 sm:flex sm:w-80 lg:w-96`}>
        {/* Tabs */}
        <div className="flex border-b border-neutral-800 p-2">
          <button className="flex-1 rounded-lg bg-neutral-800 py-2 text-sm font-semibold text-white">Chat</button>
          <button className="flex-1 rounded-lg py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors">Records</button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="rounded-xl rounded-tl-none bg-neutral-800 p-3 text-sm max-w-[85%]">
            Hello, please share your previous prescription if you have it.
          </div>
          <div className="rounded-xl rounded-tr-none bg-primary-600 p-3 text-sm max-w-[85%] self-end ml-auto">
            Sure doctor, uploading it now.
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center gap-2 rounded-xl bg-neutral-800 p-2">
            <button className="p-2 text-neutral-400 hover:text-white transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
