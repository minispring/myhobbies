package models;

import play.data.format.Formats;
import play.db.ebean.Model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="participations")
public class TParticipation extends Model {

    @Id
    @GeneratedValue
    public Long id;

    @ManyToOne
    public TPost post;

    @OneToOne
    public TCircle circle;

    @OneToOne
    public User person;

    //e.g. CIRCLE,PERSON
    public String type;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date create_at;

    @Formats.DateTime(pattern="yyyy-MM-dd HH:mm:ss")
    public Date update_at;
}
