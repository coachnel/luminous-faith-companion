
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, email, type, data } = await req.json()

    console.log('Sending notification email:', { userId, email, type })

    let subject = ''
    let htmlContent = ''

    switch (type) {
      case 'new_community_content':
        subject = `📢 Nouveau ${data.contentType} dans la communauté`
        htmlContent = `
          <h2>Nouveau contenu dans votre communauté spirituelle !</h2>
          <p><strong>${data.authorName}</strong> a publié un nouveau ${data.contentType} :</p>
          <h3>"${data.title}"</h3>
          <p>Connectez-vous à l'application pour découvrir ce nouveau contenu et interagir avec la communauté.</p>
          <br>
          <p>Bénédictions,<br>L'équipe Compagnon Spirituel</p>
        `
        break
        
      case 'challenge_reminder':
        subject = '⏰ Rappel de votre défi spirituel'
        htmlContent = `
          <h2>N'oubliez pas votre défi !</h2>
          <p>Il est temps de valider votre progression pour le défi :</p>
          <h3>"${data.challengeTitle}"</h3>
          <p>Chaque jour compte dans votre cheminement spirituel. Continuez votre belle progression !</p>
          <br>
          <p>Courage et bénédictions,<br>L'équipe Compagnon Spirituel</p>
        `
        break
        
      case 'monthly_challenges':
        subject = '🎯 Nouveaux défis mensuels disponibles !'
        htmlContent = `
          <h2>De nouveaux défis vous attendent !</h2>
          <p>Un nouveau mois commence avec de nouveaux défis spirituels adaptés à cette période.</p>
          <p>Découvrez les nouveaux défis suggérés et choisissez celui qui correspond le mieux à votre cheminement spirituel actuel.</p>
          <br>
          <p>Que ce nouveau mois soit riche en croissance spirituelle !<br>L'équipe Compagnon Spirituel</p>
        `
        break
        
      case 'test':
        subject = '🧪 Test de notification email'
        htmlContent = `
          <h2>Test réussi !</h2>
          <p>Votre système de notifications par email fonctionne parfaitement.</p>
          <p>Vous recevrez maintenant les notifications importantes directement dans votre boîte mail.</p>
          <br>
          <p>L'équipe Compagnon Spirituel</p>
        `
        break
        
      default:
        subject = 'Notification de votre Compagnon Spirituel'
        htmlContent = `
          <h2>Nouvelle notification</h2>
          <p>Vous avez reçu une nouvelle notification de votre application Compagnon Spirituel.</p>
          <p>Connectez-vous pour en savoir plus.</p>
        `
    }

    const { data: emailResult, error } = await resend.emails.send({
      from: 'Compagnon Spirituel <noreply@resend.dev>',
      to: [email],
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🙏 Compagnon Spirituel</h1>
              </div>
              <div class="content">
                ${htmlContent}
              </div>
              <div class="footer">
                <p>Vous recevez cet email car vous êtes inscrit aux notifications de Compagnon Spirituel.</p>
              </div>
            </div>
          </body>
        </html>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      throw error
    }

    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true, emailId: emailResult.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error in send-notification-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
