<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminMessageNotification extends Notification
{
    use Queueable;

    public $title;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($title, $message)
    {
        $this->title = $title;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $userName = $notifiable->first_name ? $notifiable->first_name . ' ' . $notifiable->last_name : 'Utilisateur';
        $frontendUrl = rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');

        return (new MailMessage)
            ->subject($this->title)
            ->view('emails.admin-notification', [
                'title' => $this->title,
                'bodyMessage' => $this->message,
                'userName' => $userName,
                'logoUrl' => 'https://res.cloudinary.com/dbfudloiy/image/upload/v1776329323/royaumeDuMarocLogo_nk3bpl.png',
                'ctaLink' => $frontendUrl . '/notifications'
            ]);
    }

    /**
     * Get the array representation of the notification.
     * THIS IS THE KEY METHOD - It stores the data in the database
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->title,
            'message' => $this->message,
            'type' => 'admin_message',
            'sent_by' => auth()->id() ?? null,
            'sent_at' => now()->toISOString(),
        ];
    }
}