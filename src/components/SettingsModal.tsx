import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getApiKey, setApiKey } from "@/lib/gemini";

const SettingsModal = () => {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (open) setKey(getApiKey());
  }, [open]);

  const handleSave = () => {
    setApiKey(key.trim());
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 text-foreground/40 hover:text-foreground transition-colors duration-200">
          <Settings className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border font-mono-hud max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono-hud text-foreground text-xs tracking-[0.3em] uppercase">
            System Configuration
          </DialogTitle>
          <DialogDescription className="text-[10px] text-foreground/30 tracking-wider">
            Configure your Gemini API credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <label className="text-[10px] tracking-[0.2em] uppercase text-foreground/50 block mb-2">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                className="w-full bg-background border border-border text-foreground text-xs p-3 pr-10
                  placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-[9px] text-foreground/30 mt-2 tracking-wider">
              FREE — Get yours at{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 underline hover:text-foreground"
              >
                aistudio.google.com
              </a>
            </p>
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-mono-hud text-xs tracking-[0.2em] uppercase h-auto py-2.5"
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
