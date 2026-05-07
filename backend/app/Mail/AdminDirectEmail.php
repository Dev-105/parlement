<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminDirectEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $title;
    public $message;
    public $userName;
    public $logoUrl;
    public $ctaLink;
    public $color;

    public $email;
    /**
     * Create a new message instance.
     */
    public function __construct($title, $message, $email , $color = 'orange', $userName = 'Utilisateur', $logoUrl = null, $ctaLink = null)
    {
        $this->title = $title;
        $this->message = $message;
        $this->color = $color;
        $this->userName = $userName;
        $this->logoUrl = 'https://res.cloudinary.com/dbfudloiy/image/upload/v1776329323/royaumeDuMarocLogo_nk3bpl.png';
        $this->ctaLink = $ctaLink ?? rtrim(env('FRONTEND_URL', 'http://localhost:5173'), '/');
        $this->email = $email;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->title,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-notification',
            // view: 'emails.facebook',
            with: [
                'title' => $this->title,
                'bodyMessage' => $this->message,
                'userName' => $this->userName,
                'logoUrl' => $this->logoUrl,
                'ctaLink' => $this->ctaLink,
                'color' => $this->color,
                'email' => $this->email,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
