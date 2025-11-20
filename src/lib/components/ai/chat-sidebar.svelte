<script lang="ts">
  import { MessageCircle, Send, X, Sparkles, Loader2 } from "lucide-svelte";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { cn } from "$lib/utils";

  let { class: className }: { class?: string } = $props();

  let isOpen = $state(false);
  let message = $state("");
  let messages = $state<Array<{ role: "user" | "assistant"; content: string }>>([]);
  let isLoading = $state(false);

  async function sendMessage() {
    if (!message.trim() || isLoading) return;

    const userMessage = message;
    message = "";
    messages = [...messages, { role: "user", content: userMessage }];
    isLoading = true;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, history: messages }),
      });

      const data = await response.json();
      messages = [...messages, { role: "assistant", content: data.response }];
    } catch (error) {
      messages = [
        ...messages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ];
    } finally {
      isLoading = false;
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }
</script>

<!-- Toggle Button -->
{#if !isOpen}
  <button
    onclick={() => (isOpen = true)}
    class="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl"
  >
    <Sparkles class="h-6 w-6" />
  </button>
{/if}

<!-- Sidebar -->
{#if isOpen}
  <div
    class={cn(
      "fixed right-0 top-0 z-50 flex h-screen w-96 flex-col border-l bg-gradient-to-b from-white to-purple-50 shadow-2xl dark:from-gray-900 dark:to-purple-900",
      className,
    )}
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between border-b bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 p-4 text-white"
    >
      <div class="flex items-center gap-2">
        <Sparkles class="h-5 w-5" />
        <h2 class="text-lg font-bold">BadgerPlan AI</h2>
      </div>
      <button
        onclick={() => (isOpen = false)}
        class="rounded-full p-1 transition-colors hover:bg-white/20"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <!-- Messages -->
    <div class="flex-1 space-y-4 overflow-y-auto p-4">
      {#if messages.length === 0}
        <div class="flex h-full flex-col items-center justify-center text-center">
          <div
            class="mb-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 p-4"
          >
            <MessageCircle class="h-8 w-8 text-white" />
          </div>
          <h3 class="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            Hi! I'm your AI course assistant
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Ask me about courses, career paths, or what to take for your major!
          </p>
        </div>
      {:else}
        {#each messages as msg}
          <div
            class={cn(
              "rounded-2xl p-3",
              msg.role === "user"
                ? "ml-auto max-w-[80%] bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                : "mr-auto max-w-[85%] bg-white dark:bg-gray-800",
            )}
          >
            <p class="text-sm">{msg.content}</p>
          </div>
        {/each}

        {#if isLoading}
          <div class="mr-auto max-w-[85%] rounded-2xl bg-white p-3 dark:bg-gray-800">
            <div class="flex items-center gap-2 text-gray-500">
              <Loader2 class="h-4 w-4 animate-spin" />
              <span class="text-sm">Thinking...</span>
            </div>
          </div>
        {/if}
      {/each}
    </div>

    <!-- Input -->
    <div class="border-t bg-white p-4 dark:bg-gray-900">
      <form
        onsubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        class="flex gap-2"
      >
        <Input
          bind:value={message}
          onkeypress={handleKeyPress}
          placeholder="Ask about courses, careers, or majors..."
          class="flex-1 rounded-full"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          class="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Send class="h-4 w-4" />
        </Button>
      </form>
      <p class="mt-2 text-center text-xs text-gray-500">
        Powered by Claude AI
      </p>
    </div>
  </div>
{/if}
